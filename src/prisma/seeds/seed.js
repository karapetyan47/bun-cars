import { PrismaClient } from '@prisma/client';
import { parseArgs } from 'util';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Get current file and directory paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Parse command-line arguments
const { values } = parseArgs({
  args: Bun.argv,
  allowPositionals: true,
  options: {
    seeder: {
      type: 'string',
      default: undefined,
    },
    verbose: {
      type: 'boolean',
      default: false,
      short: 'v',
    },
  },
});

const prismaClient = new PrismaClient();
const verbose = values.verbose;

/**
 * Logs message if verbose mode is enabled
 * @param {string} message - Message to log
 */
function log(message) {
  if (verbose) {
    console.log(message);
  }
}

/**
 * Loads and executes a seeder function from a file
 * @param {string} file - Path to the seeder file
 * @returns {Promise} - Promise representing the seeder execution
 */
async function executeSeed(file) {
  try {
    log(`Loading seeder from ${file}...`);
    const seedModule = await import(`./${file}`);
    const seedFunction = seedModule?.default;

    if (!seedFunction || typeof seedFunction !== 'function') {
      throw new Error(`No default export function found in ${file}`);
    }

    log(`Executing seeder from ${file}...`);
    return seedFunction(prismaClient);
  } catch (error) {
    console.error(`Failed to execute seeder ${file}: ${error.message}`);
    throw error; // Re-throw to be caught by the main error handler
  }
}

/**
 * Gets all valid seed files in the current directory
 * @returns {string[]} - Array of seed file names
 */
function getSeedFiles() {
  return fs.readdirSync(__dirname).filter(
    (file) =>
      fs.statSync(path.join(__dirname, file)).isFile() &&
      file !== path.basename(__filename) && // Exclude the current file
      file.endsWith('.js') // Only include JavaScript files
  );
}

/**
 * Main function to run seeders
 */
async function main() {
  try {
    console.log('Starting database seed process...');

    if (values.seeder) {
      // Run a single seeder
      console.log(`Running specific seeder: ${values.seeder}`);
      await executeSeed(values.seeder);
      console.log(`Seeder ${values.seeder} completed successfully`);
    } else {
      // Run all seeders
      const files = getSeedFiles();
      console.log(`Found ${files.length} seeders to execute`);

      if (files.length === 0) {
        console.warn('No seed files found in the current directory.');
        return;
      }

      log(`Seed files: ${files.join(', ')}`);

      // Execute all seeders in parallel with proper error handling
      const results = await Promise.allSettled(
        files.map((file) => executeSeed(file))
      );

      // Report results
      const succeeded = results.filter((r) => r.status === 'fulfilled').length;
      const failed = results.filter((r) => r.status === 'rejected').length;

      console.log(
        `Seed process completed: ${succeeded} succeeded, ${failed} failed`
      );

      // If any seeders failed, show details
      if (failed > 0) {
        console.error('Failed seeders:');
        results.forEach((result, index) => {
          if (result.status === 'rejected') {
            console.error(`- ${files[index]}: ${result.reason.message}`);
          }
        });

        // If all seeders failed, exit with error
        if (failed === files.length) {
          throw new Error('All seeders failed to execute');
        }
      }
    }
  } catch (error) {
    console.error(`Seed process failed: ${error.message}`);
    process.exit(1);
  } finally {
    // Always disconnect properly from the database
    await prismaClient
      .$disconnect()
      .catch((e) =>
        console.error(`Error disconnecting from Prisma: ${e.message}`)
      );
  }
}

// Run the main function
main();
