#!/bin/bash

BOOTSTRAP_CSS=src/styles/css/bootstrap.base.css

postprocess_css() {
    # Apply replace_rem_w_em to the generated CSS file
    replace_rem_w_em "$BOOTSTRAP_CSS"

    echo "CSS post-processing completed."
}

replace_rem_w_em () {
    echo "Replacing REMs with EMs..."
    sed -i.bak -E "s|([0-9])rem|\1em|g" "$1" && rm "$1.bak"
    if [ $? -ne 0 ]; then
        echo "Failed to replace REMs with EMs in $1... Aborting."
        exit 1
    fi
}

# Call the functions
postprocess_css
exit $?
