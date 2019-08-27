# Mac terminal cheat sheet

## Shortcut

| Shortcut      | Explanation                                                      |
| :------------ | ---------------------------------------------------------------- |
| Tab           | Auto-complete file and folder names                              |
| **Ctrl + A**  | Go to the beginning of the line you're currently typing on       |
| **Ctrl + E**  | Go to the end of the line you're currently typing on             |
| **Ctrl + U**  | Cut the line                                                     |
| **Ctrl + K**  | Cut the line after the cursor                                    |
| **Ctrl + W**  | Delete the word before the cursor                                |
| Ctrl + T      | Swap the last two characters before the cursor                   |
| Esc + T       | Swap the last two words before the cursor                        |
| **Ctrl + L**  | Clear the screen                                                 |
| Ctrl + C      | Kill whatever you're running                                     |
| Ctrl + D      | Exit the current shell                                           |
| Option + →    | Move cursor one word forward                                     |
| Option + ←    | Move cursor one word backward                                    |
| **Ctrl + Y**  | Paste whatever was cut by the last command (Ctrl K/U)            |
| Ctrl + Z      | Puts whatever you're running into a suspended background process |
| **Ctrl + \_** | **Undo the last command**                                        |

## Basics

| **Basics**         |                                                            |
| ------------------ | ---------------------------------------------------------- |
| / (Forward Slash)  | Top level directory                                        |
| . (Single Period)  | Current directory                                          |
| .. (Double Period) | Parent directory                                           |
| ~ (Tilde)          | Home directory                                             |
| sudo [command]     | Run command with the security privileges of the super user |
| [command] -h       | Get help about a command                                   |
| man [command]      | Show the help manual of the command                        |
| top                | Displays active processes. Press q to quit                 |
| locate             | Find file (quick search of system index)                   |

## Change Directory

| **Change Directory** |                                               |
| -------------------- | --------------------------------------------- |
| cd                   | Home directory                                |
| cd [folder]          | Change directory, e.g. cd Documents           |
| cd ~                 | Home directory                                |
| cd /                 | Root of the drive                             |
| **cd -**             | Previous directory or folder you last browsed |
| pwd                  | Show your working directory                   |
| cd ..                | Move up to the parent directory               |
| cd ../..             | Move up two levels                            |

## List Directory Contents

| ls         | Display the name of files and subdirectories in the directory                                                                                        |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| **ls -a**  | List all entries including those with .(period) and ..(double period)                                                                                |
| **ls -1**  | Output the list of files in one entry per line format                                                                                                |
| ls -F      | Display a / (slash) immediately after each path that is a directory, \* (asterisk) after executable programs or scripts, and @ after a symbolic link |
| ls -S      | Sort files or entries by size                                                                                                                        |
| **ls -l**  | List in a long format. Includes file mode, owner and group name, date and time file was modified, pathname, and more                                 |
| **ls -t**  | List the files sorted by time modified (most recent first)                                                                                           |
| **ls -lh** | Long listing with human readable file sizes in KB, MB, or GB                                                                                         |
| ls -o      | List the file names with size, owner, and flags                                                                                                      |
| **ls -a**  | List detailed directory contents, including hidden files                                                                                             |
| **ls -R**  | Entire content of folder recursively                                                                                                                 |
| ls -r      | Reverse order                                                                                                                                        |
| ls -m      | Comma-separated output                                                                                                                               |

## FILE MANAGEMENT

| Key/Command                               | Description                                                                                              |
| ----------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| **open [file]**                           | Opens a file                                                                                             |
| **open .**                                | Opens current directory                                                                                  |
| **nano [file]**                           | Opens the file using the nano editor                                                                     |
| **vim [file]**                            | Opens the file using the vim editor                                                                      |
| **touch [file]**                          | Create a new empty file                                                                                  |
| less [file]                               | Output file content delivered in screensize chunks                                                       |
| head file1                                | Show first 10 lines of file1                                                                             |
| tail file1                                | Show last 10 lines of file1                                                                              |
| tail -F file1                             | Output last lines of file1 as it changes, 监控变化                                                       |
| cat [file1] \[file2]                      | Concatenate to screen; `cat file.txt | grep derek >> derek.txt`把 file.txt 里面 derek 行追加到 derek.txt |
| pwd                                       | Full path to working directory                                                                           |
| .                                         | Current folder, e.g. `ls .`                                                                              |
| ..                                        | Parent/enclosing directory, e.g. `ls ..`                                                                 |
| ls -l ..                                  | Long listing of parent directory                                                                         |
| cd ../../                                 | Move 2 levels up                                                                                         |
| rm [file]                                 | Remove a file, e.g. `rm data.tmp`                                                                        |
| rm -i [file]                              | Remove with confirmation                                                                                 |
| **rm -r [dir]**                           | Remove a directory and contents                                                                          |
| **rm -f [file]**                          | Force removal without confirmation                                                                       |
| rm [file1] \[file2] \[file3]              | Delete multiple files without any confirmation                                                           |
| cp [file] \[newfile]                      | Copy file to file                                                                                        |
| cp [file] \[dir]                          | Copy file to directory                                                                                   |
| cp -R [dir] \["new dir"]                  | Copy a folder to a new folder with spaces in the filename                                                |
| cp [file1] \[file2] \[file3] /Users/[dir] | Copy multiple files to a folder                                                                          |
| mv [file] \[new filename]                 | Move/Rename, e.g. `mv file1.ad /tmp`                                                                     |
| mv \*.png [dir]                           | Move all PNG files from current folder to a different folder                                             |
| **pbcopy < [file]**                       | Copies file contents to clipboard                                                                        |
| pbpaste                                   | Paste clipboard contents                                                                                 |
| **pbpaste > [file]**                      | Paste clipboard contents into file, `pbpaste > paste-test.txt`                                           |

## DIRECTORY MANAGEMENT

| Key/Command                  | Description                                               |
| ---------------------------- | --------------------------------------------------------- |
| mkdir [dir]                  | Create new directory                                      |
| mkdir "[dir]"                | Create a folder with a space in the filename              |
| mkdir -p [dir]/[dir]         | Create nested directories                                 |
| mkdir [dir1] \[dir2] \[dir3] | Create several folders at once                            |
| rmdir [dir]                  | Remove directory ( only operates on empty directories )   |
| rm -R [dir]                  | Remove directory and contents                             |
| **[command] > [file]**       | Push output to file, keep in mind it will get overwritten |
| **[command] >> [file]**      | Append output to existing file                            |
| **[command] < [file]**       | Tell command to read content from a file                  |

## CHAINING COMMANDS

| Key/Command                  | Description                                          |
| ---------------------------- | ---------------------------------------------------- |
| [command-a] ; [command-b]    | Run command A and then B, regardless of success of A |
| [command-a] && [command-b]   | Run command B if A succeeded                         |
| [command-a] \|\| [command-b] | Run command B if A failed                            |
| [command-a] &                | Run command A in background                          |

## PIPING COMMANDS

| Key/Command                | Description                                                                        |
| -------------------------- | ---------------------------------------------------------------------------------- |
| [command-a] \| [command-b] | Run command A and then pass the result to command B e.g `ps auxwww \| grep google` |

## COMMAND HISTORY

| Key/Command | Description                                                          |
| ----------- | -------------------------------------------------------------------- |
| history n   | Shows the stuff typed – add a number to limit the last n items       |
| Ctrl + r    | Interactively search through previously typed commands               |
| ![value]    | Execute the last command typed that starts with ‘value’              |
| ![value]:p  | Print to the console the last command typed that starts with ‘value’ |
| !!          | Execute the last command typed                                       |
| !!:p        | Print to the console the last command typed                          |

## SEARCH

| Key/Command                           | Description                                                                                                                   |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| **find [dir] -name [search_pattern]** | Search for files, e.g. `find /Users -name "file.txt"`                                                                         |
| **grep [search_pattern] \[file]**     | Search for all lines that contain the pattern, e.g. `grep "Tom" file.txt`. e.g.2 `grep De. file.txt` (search De stared lines) |
| **grep -r [search_pattern] \[dir]**   | Recursively search in all files in specified directory for all lines that contain the pattern                                 |
| **grep -v [search_pattern] \[file]**  | Search for all lines that do NOT contain the pattern                                                                          |
| **grep -i [search_pattern] \[file]**  | Search for all lines that contain the case-insensitive pattern                                                                |
| mdfind [search_pattern]               | Spotlight search for files (names, content, other metadata), e.g. `mdfind skateboard`                                         |
| mdfind -onlyin [dir] -name [pattern]  | Spotlight search for files named like pattern in the given directory                                                          |

## HELP

| Key/Command              | Description                                       |
| ------------------------ | ------------------------------------------------- |
| [command] -h             | Offers help                                       |
| [command] --help         | Offers help                                       |
| info [command]           | Offers help                                       |
| man [command]            | Show the help manual for [command]                |
| whatis [command]         | Gives a one-line description of [command]         |
| apropos [search-pattern] | Searches for command with keywords in description |

## File size and disk space

| **File Size and Disk Space** |                                                                                                                    |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| du                           | List usage for each subdirectory and its contents                                                                  |
| **du -sh [folder]**          | Human readable output of all files in a directory (tab to search folder)                                           |
| du -s                        | Display an entry for each specified file                                                                           |
| du -sk\* \| sort -nr         | List files and folders, totaling the size including the subfolders. Replace sk* with sm* to list directories in MB |
| df -h                        | Calculate your system's free disk space                                                                            |
| df -H                        | Calculate free disk space in powers of 1,000 (as opposed to 1,024)                                                 |

## Permission

| **Permissions**            |                                                                                     |
| -------------------------- | ----------------------------------------------------------------------------------- |
| ls -ld                     | Display the default permission for a home directory                                 |
| ls -ld/[dir]               | Display the read, write, and access permission of a particular folder               |
| chmod 755 [file]           | Change the permission of a file to 755                                              |
| chmod -R 600 [dir]         | Change the permission of a folder (and its contents) to 600                         |
| chown [user]:[group][file] | Change the ownership of a file to user and group. Add -R to include folder contents |

## Process

| **Processes**            |                                                                                                                                           |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| ps -ax                   | Output currently running processes. Here, a shows processes from all users and x shows processes that are not connected with the Terminal |
| ps -aux                  | Shows all the processes with %cpu, %mem, page in, PID, and command                                                                        |
| top                      | Display live information about currently running processes                                                                                |
| top -ocpu -s 5           | Display processes sorted by CPU usage, updating every 5 seconds                                                                           |
| top -o rsize             | Sort top by memory usage                                                                                                                  |
| **kill PID**             | Quit process with ID <PID>. You'll see PID as a column in the Activity Monitor                                                            |
| ps -ax \| grep [appname] | Find a process by name or PID                                                                                                             |

## Network

| **Network**                            |                                                         |
| -------------------------------------- | ------------------------------------------------------- |
| ping [host]                            | Ping host and display status                            |
| curl -O [url/to/file]                  | Download file via HTTP, HTTPS, or FTP                   |
| ssh [username]@[host]                  | Establish SSH connection to [host] with user [username] |
| scp [file] \[user]@[host]:/remote/path | Copy [file] to a remote [host]                          |
