import multer from 'multer';

export default class StorageHandler {
    static storage = null;
    static up = null;

    static initStorageHandler() {
        this.storage = multer.diskStorage({
            destination: function (req, file, callback) {
                callback(null, `uploads`); 
            },
            filename: function (req, file, callback) {
                callback(null, `${Date.now()}-${file.originalname}`);
            }
        });

        this.up = multer({
            storage: this.storage,
            limits: {
                fileSize: 10000000  // 10 MB
            },
            fileFilter(req, file, cb) {
                if (!file.originalname.match(/\.(jpeg|jpg|png|heic)$/)) {
                    // upload only png and jpg format
                    return cb(new Error('Please upload only an image under 10 MB.'));
                }
                cb(undefined, true)
            }
        });
    }

    static upload() {
        if (!this.storage || !this.up) {
            this.initStorageHandler();
        }

        return this.up;
    }
}