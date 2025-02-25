const QueryBuilder = require('../config/db.js');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const fs = require('fs');
const path = require('path');

const uploadProductMedia = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!req.files) {
      throw ApiError.badRequest('No files uploaded');
    }
    const mediaBasePath = `/uploads/product/`;
    let images = [];
    let videos = [];
    req.files.forEach((file) => {
      if (file.mimetype?.includes('image') || file.type?.includes('image')) {
        images.push(mediaBasePath + file.filename);
      } else if (file.mimetype?.includes('video') || file.type?.includes('video')) {
        videos.push(mediaBasePath + file.filename);
      }
    });
    let values = {
      images: images.join(','),
      videos: videos.join(',')
    };
    for (const key in values) {
      if (!values[key]) {
        delete values[key];
      }
    }
    console.log(`product values: ${JSON.stringify(values)}`);
    let query = new QueryBuilder().select('product', ['images', 'videos']).where(['id'], ['='], [id]);
    let result = await query.run();
    if (result.success && result.data.length > 0) {
      const existingImages = result.data[0].images;
      const existingVideos = result.data[0].videos;
      if (existingImages) {
        values.images = existingImages + ',' + values.images;
      }
      if (existingVideos) {
        values.videos = existingVideos + ',' + values.videos;
      }
      console.log(`product values after selectQ: ${JSON.stringify(values)}`);
    }
    query = new QueryBuilder().update('product', values).where(['id'], ['='], [id]);
    result = await query.run();
    if (result.success && result.data.affectedRows > 0) {
      return res.status(httpStatus.OK).json({ message: 'Media uploaded successfully', images, videos });
    } else {
      throw ApiError.internal('Failed to upload media');
    }
  } catch (error) {
    next(error);
  }
};

const deleteProductMedia = async (req, res, next) => {
  try {
    const id = req.params.id;
    const deletedImages = req.body.images;
    const deletedVideos = req.body.videos;
    let query = new QueryBuilder().select('product', ['images', 'videos']).where(['id'], ['='], [id]);
    let result = await query.run();
    if (result.success && result.data.length > 0) {
      const { images, videos } = result.data[0];
      let values = {};
      if (deletedImages) {
        deletedImages.forEach((image) => {
          fs.unlink(path.join('..', image), (error) => {
            if (error) {
              console.log('Error deleting image:', error);
            }
          });
        });
        values.images = images
          ?.split(',')
          .filter((image) => !deletedImages.includes(image))
          .join(',');
      }
      if (deletedVideos) {
        deletedVideos.forEach((video) => {
          fs.unlink(path.join('..', video), (error) => {
            if (error) {
              console.log('Error deleting video:', error);
            }
          });
        });
        values.videos = videos
          ?.split(',')
          .filter((video) => !deletedVideos.includes(video))
          .join(',');
      }
      if (!deletedImages && !deletedVideos) {
        images?.split(',')?.forEach((image) => {
          fs.unlink(path.join('..', image), (error) => {
            if (error) {
              console.log('Error deleting image:', error);
            }
          });
        });
        videos?.split(',')?.forEach((video) => {
          fs.unlink(path.join('..', video), (error) => {
            if (error) {
              console.log('Error deleting video:', error);
            }
          });
        });
        values = { images: null, videos: null };
      }
      query = new QueryBuilder().update('product', values).where(['id'], ['='], [id]);
      result = await query.run();
      if (result.success && result.data.affectedRows > 0) {
        return res.status(httpStatus.OK).json({ message: 'Media deleted successfully' });
      } else {
        throw ApiError.internal('Failed to delete media');
      }
    } else {
      throw ApiError.notFound('Product not found');
    }
  } catch (error) {
    next(error);
  }
};

const uploadPaidAdImage = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!req.file) {
      throw ApiError.badRequest('No file uploaded');
    }
    const image = '/uploads/paidad/' + req.file.filename;
    const query = new QueryBuilder().update('paid_ad', { image }).where(['id'], ['='], [id]);
    const result = await query.run();
    if (result.success && result.data.affectedRows > 0) {
      return res.status(httpStatus.OK).json({ message: 'Image uploaded successfully', image });
    } else {
      throw ApiError.internal('Failed to upload image');
    }
  } catch (error) {
    next(error);
  }
};

const deletePaidAdImage = async (req, res, next) => {
  try {
    const id = req.params.id;
    let query = QueryBuilder().select('paid_ad', ['image']).where(['id'], ['='], [id]);
    let result = await query.run();
    if (result.success && result.data.length > 0) {
      const { image } = result.data[0];
      if (image) {
        fs.unlink(path.join('..', image), (error) => {
          if (error) {
            console.log('Error deleting image:', error);
          }
        });
      }
      query = new QueryBuilder().update('paid_ad', { image: null }).where(['id'], ['='], [id]);
      result = await query.run();
      if (result.success && result.data.affectedRows > 0) {
        return res.status(httpStatus.OK).json({ message: 'Image deleted successfully' });
      } else {
        throw ApiError.internal('Failed to delete image');
      }
    } else {
      throw ApiError.notFound('Paid Ad not found');
    }
  } catch (error) {
    next(error);
  }
};

const uploadArticleImage = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!req.file) {
      throw ApiError.badRequest('No file uploaded');
    }
    const image = '/uploads/article/' + req.file.filename;
    const query = new QueryBuilder().update('article', { image }).where(['id'], ['='], [id]);
    const result = await query.run();
    if (result.success && result.data.affectedRows > 0) {
      return res.status(httpStatus.OK).json({ message: 'Image uploaded successfully', image });
    } else {
      throw ApiError.internal('Failed to upload image');
    }
  } catch (error) {
    next(error);
  }
};

const deleteArticleImage = async (req, res, next) => {
  try {
    const id = req.params.id;
    let query = QueryBuilder().select('article', ['image']).where(['id'], ['='], [id]);
    let result = await query.run();
    if (result.success && result.data.length > 0) {
      const { image } = result.data[0];
      if (image) {
        fs.unlink(path.join('..', image), (error) => {
          if (error) {
            console.log('Error deleting image:', error);
          }
        });
      }
      query = new QueryBuilder().update('article', { image: null }).where(['id'], ['='], [id]);
      result = await query.run();
      if (result.success && result.data.affectedRows > 0) {
        return res.status(httpStatus.OK).json({ message: 'Image deleted successfully' });
      } else {
        throw ApiError.internal('Failed to delete image');
      }
    } else {
      throw ApiError.notFound('Article not found');
    }
  } catch (error) {
    next(error);
  }
};

const uploadAdPackageImage = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!req.file) {
      throw ApiError.badRequest('No file uploaded');
    }
    const icon = '/uploads/adpackage/' + req.file.filename;
    const query = new QueryBuilder().update('ad_package', { icon }).where(['id'], ['='], [id]);
    const result = await query.run();
    if (result.success && result.data.affectedRows > 0) {
      return res.status(httpStatus.OK).json({ message: 'Icon uploaded successfully', icon });
    } else {
      throw ApiError.internal('Failed to upload icon');
    }
  } catch (error) {
    next(error);
  }
};

const deleteAdPackageImage = async (req, res, next) => {
  try {
    const id = req.params.id;
    let query = QueryBuilder().select('ad_package', ['icon']).where(['id'], ['='], [id]);
    let result = await query.run();
    if (result.success && result.data.length > 0) {
      const { icon } = result.data[0];
      if (icon) {
        fs.unlink(path.join('..', icon), (error) => {
          if (error) {
            console.log('Error deleting image:', error);
          }
        });
      }
      query = new QueryBuilder().update('ad_package', { icon: null }).where(['id'], ['='], [id]);
      result = await query.run();
      if (result.success && result.data.affectedRows > 0) {
        return res.status(httpStatus.OK).json({ message: 'Icon deleted successfully' });
      } else {
        throw ApiError.internal('Failed to delete icon');
      }
    } else {
      throw ApiError.notFound('Ad Package not found');
    }
  } catch (error) {
    next(error);
  }
};

const uploadUserIcon = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!req.file) {
      throw ApiError.badRequest('No file uploaded');
    }
    const icon = '/uploads/user/' + req.file.filename;
    const query = new QueryBuilder().update('user', { icon }).where(['id'], ['='], [id]);
    const result = await query.run();
    if (result.success && result.data.affectedRows > 0) {
      return res.status(httpStatus.OK).json({ message: 'Icon uploaded successfully', icon });
    } else {
      throw ApiError.internal('Failed to upload icon');
    }
  } catch (error) {
    next(error);
  }
};

const deleteUserIcon = async (req, res, next) => {
  try {
    const id = req.params.id;
    let query = QueryBuilder().select('user', ['icon']).where(['id'], ['='], [id]);
    let result = await query.run();
    if (result.success && result.data.length > 0) {
      const { icon } = result.data[0];
      if (icon) {
        fs.unlink(path.join('..', icon), (error) => {
          if (error) {
            console.log('Error deleting image:', error);
          }
        });
      }
      query = new QueryBuilder().update('user', { icon: null }).where(['id'], ['='], [id]);
      result = await query.run();
      if (result.success && result.data.affectedRows > 0) {
        return res.status(httpStatus.OK).json({ message: 'Icon deleted successfully' });
      } else {
        throw ApiError.internal('Failed to delete icon');
      }
    } else {
      throw ApiError.notFound('User not found');
    }
  } catch (error) {
    next(error);
  }
};

const uploadCategoryIcon = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!req.file) {
      throw ApiError.badRequest('No file uploaded');
    }
    const icon = '/uploads/category/' + req.file.filename;
    const query = new QueryBuilder().update('category', { icon }).where(['id'], ['='], [id]);
    const result = await query.run();
    if (result.success && result.data.affectedRows > 0) {
      return res.status(httpStatus.OK).json({ message: 'Icon uploaded successfully', icon });
    } else {
      throw ApiError.internal('Failed to upload icon');
    }
  } catch (error) {
    next(error);
  }
};

const deleteCategoryIcon = async (req, res, next) => {
  try {
    const id = req.params.id;
    let query = QueryBuilder().select('category', ['icon']).where(['id'], ['='], [id]);
    let result = await query.run();
    if (result.success && result.data.length > 0) {
      const { icon } = result.data[0];
      if (icon) {
        fs.unlink(path.join('..', icon), (error) => {
          if (error) {
            console.log('Error deleting image:', error);
          }
        });
      }
      query = new QueryBuilder().update('category', { icon: null }).where(['id'], ['='], [id]);
      result = await query.run();
      if (result.success && result.data.affectedRows > 0) {
        return res.status(httpStatus.OK).json({ message: 'Icon deleted successfully' });
      } else {
        throw ApiError.internal('Failed to delete icon');
      }
    } else {
      throw ApiError.notFound('Category not found');
    }
  } catch (error) {
    next(error);
  }
};

const uploadSubCategoryIcon = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!req.file) {
      throw ApiError.badRequest('No file uploaded');
    }
    const icon = '/uploads/subcategory/' + req.file.filename;
    const query = new QueryBuilder().update('subcategory', { icon }).where(['id'], ['='], [id]);
    const result = await query.run();
    if (result.success && result.data.affectedRows > 0) {
      return res.status(httpStatus.OK).json({ message: 'Icon uploaded successfully', icon });
    } else {
      throw ApiError.internal('Failed to upload icon');
    }
  } catch (error) {
    next(error);
  }
};

const deleteSubCategoryIcon = async (req, res, next) => {
  try {
    const id = req.params.id;
    let query = QueryBuilder().select('subcategory', ['icon']).where(['id'], ['='], [id]);
    let result = await query.run();
    if (result.success && result.data.length > 0) {
      const { icon } = result.data[0];
      if (icon) {
        fs.unlink(path.join('..', icon), (error) => {
          if (error) {
            console.log('Error deleting image:', error);
          }
        });
      }
      query = new QueryBuilder().update('subcategory', { icon: null }).where(['id'], ['='], [id]);
      result = await query.run();
      if (result.success && result.data.affectedRows > 0) {
        return res.status(httpStatus.OK).json({ message: 'Icon deleted successfully' });
      } else {
        throw ApiError.internal('Failed to delete icon');
      }
    } else {
      throw ApiError.notFound('Subcategory not found');
    }
  } catch (error) {
    next(error);
  }
};

const uploadThirdCategoryIcon = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!req.file) {
      throw ApiError.badRequest('No file uploaded');
    }
    const icon = '/uploads/thirdcategory/' + req.file.filename;
    const query = new QueryBuilder().update('thirdcategory', { icon }).where(['id'], ['='], [id]);
    const result = await query.run();
    if (result.success && result.data.affectedRows > 0) {
      return res.status(httpStatus.OK).json({ message: 'Icon uploaded successfully', icon });
    } else {
      throw ApiError.internal('Failed to upload icon');
    }
  } catch (error) {
    next(error);
  }
};

const deleteThirdCategoryIcon = async (req, res, next) => {
  try {
    const id = req.params.id;
    let query = QueryBuilder().select('thirdcategory', ['icon']).where(['id'], ['='], [id]);
    let result = await query.run();
    if (result.success && result.data.length > 0) {
      const { icon } = result.data[0];
      if (icon) {
        fs.unlink(path.join('..', icon), (error) => {
          if (error) {
            console.log('Error deleting image:', error);
          }
        });
      }
      query = new QueryBuilder().update('thirdcategory', { icon: null }).where(['id'], ['='], [id]);
      result = await query.run();
      if (result.success && result.data.affectedRows > 0) {
        return res.status(httpStatus.OK).json({ message: 'Icon deleted successfully' });
      } else {
        throw ApiError.internal('Failed to delete icon');
      }
    } else {
      throw ApiError.notFound('Thirdcategory not found');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadProductMedia,
  deleteProductMedia,
  uploadPaidAdImage,
  deletePaidAdImage,
  uploadArticleImage,
  deleteArticleImage,
  uploadAdPackageImage,
  deleteAdPackageImage,
  uploadUserIcon,
  deleteUserIcon,
  uploadCategoryIcon,
  deleteCategoryIcon,
  uploadSubCategoryIcon,
  deleteSubCategoryIcon,
  uploadThirdCategoryIcon,
  deleteThirdCategoryIcon
};
