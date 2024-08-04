class ExtensionValidator {
    isFileValid = async (files, allowedExtensions, numberOfFilesAllowed) => {
        try {   
            if (!files) return "File is empty";
            let checkFiles = [];
            if (!Array.isArray(files)) checkFiles = [files];
            if (checkFiles.length > numberOfFilesAllowed) return `Number of files cannot exceed ${numberOfFilesAllowed}`;
            for (let i = 0; i < checkFiles.length; i++){
                if (!this.checkFileExtensionAllowed(checkFiles[i].mimetype, allowedExtensions)) return "File extension not allowed";
            }
            return null;
        } catch (e) {
            return "Failed handling files";
        }
    }

    checkFileExtensionAllowed(fileExt, allowedExtensions){
        if (!fileExt) return false; 
        if (!allowedExtensions) return true;
        if (!Array.isArray(allowedExtensions)) return false;
        return allowedExtensions.includes(fileExt);
    }
}

export default new ExtensionValidator();