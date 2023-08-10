const Assets = require("./schemas/assets_schema");
const { customLogger } = require("../utils/logger");

function getHomePageBannersRepo(clientId) {
    customLogger.info({
        fileName: "/repo/assets_repo",
        functionName: "getHomePageBannersRepo",
        context: "Before Execution",
        message: "Getting Home page banners",
    });
    customLogger.info({
        fileName: "/repo/assets_repo",
        functionName: "getHomePageBannersRepo",
        context: "After Execution",
        message: "Going to return without errors",
    });
    return clientId
        ? Assets.findOne(
              {
                  clientId,
              },
              { homeBanners: 1, clientId: 1, _id: 0 }
          )
        : null;
}

function updateHomeBannersRepo(clientId, userId, homeBannersList) {
    customLogger.info({
        fileName: "/repo/assets_repo",
        functionName: "updateHomeBannersRepo",
        context: "Before Execution",
        message: "update Home page banners",
    });
    customLogger.info({
        fileName: "/repo/assets_repo",
        functionName: "updateHomeBannersRepo",
        context: "After Execution",
        message: "Going to return without errors",
    });
    return clientId
        ? Assets.updateOne(
              {
                  clientId,
              },
              {
                  homeBanners: homeBannersList,
                  createdBy: userId,
              },
              {
                  upsert: true,
              }
          )
        : null;
}

function updateDefaultHomeBannersRepo(userId, homeBannersList) {
    customLogger.info({
        fileName: "/repo/assets_repo",
        functionName: "updateDefaultHomeBannersRepo",
        context: "Before Execution",
        message: "updateDefault Home page banners",
    });
    customLogger.info({
        fileName: "/repo/assets_repo",
        functionName: "updateDefaultHomeBannersRepo",
        context: "After Execution",
        message: "Going to return without errors",
    });
    return userId
        ? Assets.updateOne(
              {
                  createdBy: userId,
                  isDefault: true,
              },
              {
                  homeBanners: homeBannersList,
              },
              {
                  upsert: true,
              }
          )
        : null;
}

function getDefaultHomePageBannersRepo() {
    customLogger.info({
        fileName: "/repo/assets_repo",
        functionName: "getDefaultHomePageBannersRepo",
        context: "Before Execution",
        message: "getDefault Home page banners",
    });
    customLogger.info({
        fileName: "/repo/assets_repo",
        functionName: "getDefaultHomePageBannersRepo",
        context: "After Execution",
        message: "Going to return without errors",
    });
    return Assets.findOne(
        {
            isDefault: true,
        },
        { homeBanners: 1, _id: 0 }
    ).exec();
}

module.exports = {
    getHomePageBannersRepo,
    updateHomeBannersRepo,
    getDefaultHomePageBannersRepo,
    updateDefaultHomeBannersRepo,
};
