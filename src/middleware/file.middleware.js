const path = require("path");
const Multer = require("koa-multer");
const Jimp = require("jimp");

const {
  AVATAR_PATH,
  GOODS_PICTURE,
  MATERIAL_PATH,
} = require("../constants/file-path");
const { INTERNALSERVERERROR } = require("../constants/error-types");

const avatarUpload = Multer({
  dest: AVATAR_PATH,
});
const avatarHandler = avatarUpload.single("avatar");

const goodsPictureUpload = Multer({
  dest: GOODS_PICTURE,
});

const goodsPictureHandler = goodsPictureUpload.array("picture", 9);

const pictureResize = async (ctx, next) => {
  try {
    const files = ctx.req.files;
    for (let file of files) {
      const destPath = path.join(file.destination, file.filename);
      Jimp.read(file.path).then((image) => {
        image.resize(1280, Jimp.AUTO).write(`${destPath}-large`);
        image.resize(640, Jimp.AUTO).write(`${destPath}-middle`);
        image.resize(320, Jimp.AUTO).write(`${destPath}-small`);
      });
    }
    await next();
  } catch (err) {
    console.log(err);
    const error = new Error(INTERNALSERVERERROR);
    return ctx.app.emit("error", error, ctx);
  }
};

const materialUpload = Multer({
  dest: MATERIAL_PATH,
});

const materialPictureHandler = materialUpload.array("material", 9);

module.exports = {
  avatarHandler,
  goodsPictureHandler,
  pictureResize,
  materialPictureHandler,
};
