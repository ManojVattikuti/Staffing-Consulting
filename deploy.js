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
