init python:
    import os
    import subprocess
    from subprocess import Popen

    def execute_batch_file(script_path):
        try:
            # Execute the Batch script using subrocess.popen()
            Popen(script_path,creationflags=subprocess.CREATE_NEW_CONSOLE)
            # If execution succeeds, return success message
            return "Batch script executed successfully"
        except Exception as e:
            # If there's an error, return the error message
            return "Error executing Batch script: {}".format(str(e))

init 5 python:
    addEvent(
        Event(
            persistent.event_database,
            eventlabel="testing_syafiqlim",
            category=["be right back"],
            prompt="Backup",
            pool=True,
            unlocked=True,
        ),
        markSeen=True
    )

label testing_syafiqlim:
    python:
        # Specify the path to your JavaScript file here
        batch_file_path = os.path.abspath(os.path.realpath(os.path.join("game","Submods","MAS_backupGD","backup.bat")))
        
        # Call the function to execute the Node.js script
        batch_result = execute_batch_file(batch_file_path)
        
        # Display the result or handle errors
        if "Error" in batch_result:
            renpy.say("System", "An error occurred: {}".format(batch_result))
        else:
            renpy.say("System", "Batch script execution result: {}".format(batch_result))

    m 3hub "Persistent file and folder backed up successfully."

    $ mas_idle_mailbox.send_idle_cb("testing_syafiqlim_callback")
    return "idle"

label testing_syafiqlim_callback:
    m 1eua "Welcome back, [player]."
    return