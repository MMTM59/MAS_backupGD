init python:
    import os

    def execute_node_script(script_path):
        try:
            # Execute the Node.js script using os.system()
            os.system("node {}".format(script_path))
            # If execution succeeds, return success message
            return "Node script executed successfully"
        except Exception as e:
            # If there's an error, return the error message
            return "Error executing Node script: {}".format(str(e))

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
        js_file_path = "C:/Users/syafi/OneDrive/Documents/Day23/backup.js"
        
        # Call the function to execute the Node.js script
        node_result = execute_node_script(js_file_path)
        
        # Display the result or handle errors
        if "Error" in node_result:
            renpy.say("System", "An error occurred: {}".format(node_result))
        else:
            renpy.say("System", "Node script execution result: {}".format(node_result))

    m 3hub "Persistent file and folder backed up successfully."

    $ mas_idle_mailbox.send_idle_cb("testing_syafiqlim_callback")
    return "idle"

label testing_syafiqlim_callback:
    m 1eua "Welcome back, [player]."
    return