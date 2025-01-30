const child_process = require('child_process');
const crypto = require('crypto');
const async = require('async');
const path = require('path');
const fs = require('fs');
const os = require('os');
const mimedb = require('./db.json');

function commandExists(command) {
  try {
    child_process.execSync(`${command} --version`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

module.exports = {
  generate: function (input_original, output, options, callback) {
    // Normalize arguments
    let input = input_original;

    if (typeof options === 'function') {
      callback = options;
      options = {};
    } else {
      options = options || {};
    }

    // Check for supported output format
    const extOutput = path.extname(output).toLowerCase().replace('.', '');
    const extInput = path.extname(input).toLowerCase().replace('.', '');

    if (!['gif', 'jpg', 'png'].includes(extOutput)) {
      return callback(new Error('Unsupported output format.'));
    }

    // Check for required commands
    const commands = {
      file: commandExists('file'),
      ffmpeg: commandExists('ffmpeg'),
      convert: commandExists('convert'),
      unoconv: commandExists('unoconv')
    };

    // Handle unsupported commands
    for (const [cmd, exists] of Object.entries(commands)) {
      if (!exists) {
        console.warn(`Warning: Command "${cmd}" is not installed.`);
      }
    }

    // Determine file type
    let fileType = 'other';
    for (const index in mimedb) {
      if ('extensions' in mimedb[index]) {
        for (const indexExt in mimedb[index].extensions) {
          if (mimedb[index].extensions[indexExt] === extInput) {
            fileType = index.split('/')[0]; // e.g., 'image', 'video', 'application' for PDFs
            break;
          }
        }
      }
    }

    if (extInput === 'pdf') {
      fileType = 'image'; // Treat PDF as image for preview
    }

    // Handle HTTP inputs
    if (input_original.startsWith("http://") || input_original.startsWith("https://")) {
      const urlParts = input.split("/");
      const urlFilename = urlParts[urlParts.length - 1];
      const hash = crypto.createHash('sha512').update(Math.random().toString()).digest('hex');
      const tempInput = path.join(os.tmpdir(), `${hash}_${urlFilename}`);
      const curlArgs = ['--silent', '-L', input, '-o', tempInput];
      child_process.execFileSync("curl", curlArgs);
      input = tempInput;
    }

    // Check if input is a valid file
    fs.lstat(input, (error, stats) => {
      if (error || !stats.isFile()) {
        return callback(new Error('Input is not a valid file.'));
      }

      // Generate preview based on file type
      if (fileType === 'video' && commands.ffmpeg) {
        const ffmpegArgs = ['-y', '-i', input, '-vf', 'thumbnail', '-frames:v', '1', output];
        if (options.width > 0 && options.height > 0) {
          ffmpegArgs.splice(4, 1, 'thumbnail,scale=' + options.width + ':' + options.height + (options.forceAspect ? ':force_original_aspect_ratio=decrease' : ''));
        }
        child_process.execFile('C:\\ffmpeg\\bin\\ffmpeg.exe', ffmpegArgs, (error) => {
          cleanUp(input_original, input, callback, error);
        });
      } else if (fileType === 'image' && commands.convert) {
        const convertArgs = [input + '[0]', output];
        if (options.width > 0 && options.height > 0) {
          convertArgs.unshift('-resize', `${options.width}x${options.height}`);
        }
        if (options.autorotate) convertArgs.unshift('-auto-orient');
        if (options.quality) convertArgs.unshift('-quality', options.quality);
        if (options.background) {
          convertArgs.unshift('-background', options.background, '-flatten');
        }
        child_process.execFile('convert', convertArgs, (error) => {
          cleanUp(input_original, input, callback, error);
        });
      } else if (fileType === 'application' && commands.unoconv) {
        handleOtherFiles(input, output, options, input_original, callback);
      } else {
        return callback(new Error(`Preview generation for "${fileType}" is not supported or required commands are missing.`));
      }
    });
  },

  generateSync: function (input_original, output, options) {
    // Normalize options
    options = options || {};
    let input = input_original;

    // Check for supported output format
    const extOutput = path.extname(output).toLowerCase().replace('.', '');
    const extInput = path.extname(input).toLowerCase().replace('.', '');

    if (!['gif', 'jpg', 'png'].includes(extOutput)) {
      return false;
    }

    // Check for required commands
    const commands = {
      file: commandExists('file'),
      ffmpeg: commandExists('C:\\ffmpeg\\bin\\ffmpeg.exe'),
      convert: commandExists('convert'),
      unoconv: commandExists('unoconv')
    };

    // Handle unsupported commands
    for (const [cmd, exists] of Object.entries(commands)) {
      if (!exists) {
        console.warn(`Warning: Command "${cmd}" is not installed.`);
      }
    }

    // Determine file type
    let fileType = 'other';
    for (const index in mimedb) {
      if ('extensions' in mimedb[index]) {
        for (const indexExt in mimedb[index].extensions) {
          if (mimedb[index].extensions[indexExt] === extInput) {
            fileType = index.split('/')[0]; // e.g., 'image', 'video', 'application' for PDFs
            break;
          }
        }
      }
    }

    if (extInput === 'pdf') {
      fileType = 'image'; // Treat PDF as image for preview
    }

    // Handle HTTP inputs
    if (input_original.startsWith("http://") || input_original.startsWith("https://")) {
      const urlParts = input.split("/");
      const urlFilename = urlParts[urlParts.length - 1];
      const hash = crypto.createHash('sha512').update(Math.random().toString()).digest('hex');
      const tempInput = path.join(os.tmpdir(), `${hash}_${urlFilename}`);
      const curlArgs = ['--silent', '-L', input, '-o', tempInput];
      child_process.execFileSync("curl", curlArgs);
      input = tempInput;
    }

    // Check if input is a valid file
    let stats;
    try {
      stats = fs.lstatSync(input);
      if (!stats.isFile()) {
        return false;
      }
    } catch {
      return false;
    }

    // Generate preview based on file type
    if (fileType === 'video' && commands.ffmpeg) {
      try {
        const ffmpegArgs = ['-y', '-i', input, '-vf', 'thumbnail', '-frames:v', '1', output];
        if (options.width > 0 && options.height > 0) {
          ffmpegArgs.splice(4, 1, 'thumbnail,scale=' + options.width + ':' + options.height + (options.forceAspect ? ':force_original_aspect_ratio=decrease' : ''));
        }
        child_process.execFileSync('C:\\ffmpeg\\bin\\ffmpeg.exe', ffmpegArgs);
        cleanUpSync(input_original, input);
        return true;
      } catch {
        return false;
      }
    }

    if (fileType === 'image' && commands.convert) {
      try {
        const convertArgs = [input + '[0]', output];
        if (options.width > 0 && options.height > 0) {
          convertArgs.unshift('-resize', `${options.width}x${options.height}`);
        }
        if (options.quality) convertArgs.unshift('-quality', options.quality);
        if (options.background) {
          convertArgs.unshift('-background', options.background, '-flatten');
        }
        child_process.execFileSync('convert', convertArgs);
        cleanUpSync(input_original, input);
        return true;
      } catch {
        return false;
      }
    }

    if (fileType === 'application' && commands.unoconv) {
      return handleOtherFilesSync(input, output, options, input_original);
    } else {
      return false; // Unsupported file type or missing commands
    }
  },
};

// Helper function to clean up temporary files
function cleanUp(input_original, input, callback, error) {
  if (input_original.startsWith("http://") || input_original.startsWith("https://")) {
    fs.unlink(input, (err) => {
      if (err) console.error(`Error cleaning up temp file: ${err}`);
      callback(error);
    });
  } else {
    callback(error);
  }
}

function cleanUpSync(input_original, input) {
  if (input_original.startsWith("http://") || input_original.startsWith("https://")) {
    fs.unlinkSync(input);
  }
}

function handleOtherFiles(input, output, options, input_original, callback) {
  const unoconvArgs = [input, '-f', output, '-o', output];
  child_process.execFile('unoconv', unoconvArgs, (error) => {
    cleanUp(input_original, input, callback, error);
  });
}

function handleOtherFilesSync(input, output, options, input_original) {
  const unoconvArgs = [input, '-f', output, '-o', output];
  try {
    child_process.execFileSync('unoconv', unoconvArgs);
    cleanUpSync(input_original, input);
    return true;
  } catch {
    return false;
  }
}
