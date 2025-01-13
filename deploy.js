const simpleGit = require('simple-git');
const { exec } = require('child_process');

const git = simpleGit();

const commitId = process.argv[2];
const projectName = process.argv[3];
const buildType = process.argv[4] || 'production'; // Default to production if not specified
const buildDirectory = `dist/${projectName}/browser`; // Local build directory
const sshKeyPath = process.env.SSH_KEY_PATH; // Access SSH key path from environment variable

if (!commitId || !projectName) {
  console.error('Please provide both a commit ID and a project name.');
  process.exit(1);
}

if (!sshKeyPath) {
  console.error('Please set the SSH_KEY_PATH environment variable.');
  process.exit(1);
}

// Function to deploy the build
const deployBuild = () => {
  console.log('Deploying build...');

  // Transfer files to the server
  const username = 'rakeshkumar_manda8161'; // Your server username
  const serverIP = '34.162.198.231'; // Your server IP
  const serverPath = `/home/rakeshkumar_manda8161/promates/Staffing-Consulting/dist/${projectName}/browser`; // Path on server

  exec(
    `rsync -avz -e "ssh -i ${sshKeyPath}" ${buildDirectory}/ ${username}@${serverIP}:${serverPath}/`,
    (error, stdout, stderr) => {
      if (error) {
        console.error(`Error deploying build: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
      console.log('Deployment complete.');
    },
  );
};

// Checkout to the specified commit, install dependencies, and build the project
git.checkout(commitId, (err) => {
  if (err) {
    console.error(`Error checking out commit: ${err.message}`);
    process.exit(1);
  }
  console.log(`Checked out to commit ${commitId}`);

  // Install dependencies with --legacy-peer-deps
  exec('npm install --legacy-peer-deps', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error installing dependencies: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.log('Dependencies installed.');

    // Build the Angular project
    exec(`ng build ${projectName} --configuration=${buildType}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error building project: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
        return;
      }
      console.log(`stdout: ${stdout}`);

      // Call deploy function after successful build
      deployBuild();
    });
  });
});
