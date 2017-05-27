#include <stdio.h>

int main(int argc, char** argv)
{
	if (argc < 2) return -1;
	printf("\n\n\n\n\n\n\nThis program will replace the \" character for \\\" in the file called %s. Are you sure you want to proceed?\n", argv[1]);
	getchar();

    FILE* handle = fopen(argv[1], "r+"); /* open the file for reading and updating */

    if (handle == NULL) 
    {
    	printf("File not found... Think again!\n");
    	getchar();
    	return -1; /* if file not found quit */
    }

    char current_char = 0;
    char to_replace = '"'; /* get the character to be replaced */
    char* replacement = "\\\""; /* get the replacing character */

    while ((current_char  = fgetc(handle)) != EOF) /* while it's not the end-of-file */
    {                                              /*   read a character at a time */

        if (current_char == to_replace) /* if we've found our character */
        {
            fseek(handle, ftell(handle) - 1, SEEK_SET); /* set the position of the stream
                                                           one character back, this is done by
                                                           getting the current position using     
                                                           ftell, subtracting one from it and 
                                                           using fseek to set a new position */

            fprintf(handle, "%s", replacement); /* write the new character at the new position */
        }
    }
    
    current_char = 0;
    to_replace = '\n'; /* get the character to be replaced */
    replacement = ""; /* get the replacing character */

    while ((current_char  = fgetc(handle)) != EOF) /* while it's not the end-of-file */
    {                                              /*   read a character at a time */

        if (current_char == to_replace) /* if we've found our character */
        {
            fseek(handle, ftell(handle) - 1, SEEK_SET); /* set the position of the stream
                                                           one character back, this is done by
                                                           getting the current position using     
                                                           ftell, subtracting one from it and 
                                                           using fseek to set a new position */

            fprintf(handle, ""); /* write the new character at the new position */
        }
    }

    fclose(handle); /* it's important to close the file_handle 
                       when you're done with it to avoid memory leaks */
	printf("Done!! Please check out Work.html, and copy all of the content into that JSON file.\n");
	getchar();
    return 0;
}