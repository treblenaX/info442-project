import multer from 'multer';

export default class StorageHandler {
    static storage = null;
    static upload = null;

    static initStorageHandler() {
        this.storage = multer.diskStorage({
            destination: function (req, file, callback) {
                callback(null, `uploads`);  // @TODO choose the destination
            },
            filename: function (req, file, callback) {
                callback(null, `${Date.now()}-${file.originalname}.${file.mimetype.split('/')[1]}`);
            }
        });

        this.upload = multer({
            storage: storage,
            limits: {
                fileSize: 10000000  // 10 MB
            },
            fileFilter(req, file, cb) {
                if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
                    // upload only png and jpg format
                    return cb(new Error('Please upload only an image as .png or .jpg format under 10 MB.'))
                }
                cb(undefined, true)
            }
        });
    }

    static upload() {
        if (!this.storage || !this.upload) {
            this.initStorageHandler();
        }

        return this.upload;
    }
}