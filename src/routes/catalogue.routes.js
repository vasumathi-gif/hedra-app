import { Router } from "express";
import { isAuth } from "../middlewares/auth.js";
import { handleCatalogueFiles } from "../middlewares/upload.js";
import { createCatalogue, deleteCatalogueByCode, getCatalogueByCode, getCatalogues, listCatalogues, updateCatalogueByCode } from "../controllers/catalogue.js"; // make sure filename matches

const router = Router();

router.post(
  "/createcatalogue",
  (req, _res, next) => { console.log("🧪 content-type:", req.headers["content-type"]); next(); },
  handleCatalogueFiles,
  (req, _res, next) => {
    // deep inspect what Multer gave us
    console.log("🧩 After Multer (route tap):",
      {
        keys: Object.keys(req.files || {}),
        image: req.files?.image?.[0]?.mimetype,
        pdf: req.files?.pdf?.[0]?.mimetype,
      }
    );
    next();
  },
  isAuth,
  createCatalogue
);

router.get("/listCatalogues",  listCatalogues);
router.get("/allCatalogues", getCatalogues);
router.get("/getCatalogueByCode/:code", getCatalogueByCode);
router.put(
  "/catalogue/:code",
  handleCatalogueFiles,
  isAuth,
  updateCatalogueByCode
);

router.delete("/catalogue/:code", deleteCatalogueByCode);

export default router;
