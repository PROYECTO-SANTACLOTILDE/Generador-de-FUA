import * as fs from "fs";
import * as path from "path";
import { FUAFormatFromSchemaService } from "./services/FUAFormatFromSchemaService"; // ← si tu exportes la CLASSE
// Si au contraire tu exportes une INSTANCE par défaut :
// import FUAFormatFromSchemaService from "./src/services/FUAFormatFromSchemaService";

(async () => {
  try {
    // 1) instancie si tu as exporté la classe
    const service = new FUAFormatFromSchemaService();

    // 2) mets ici un id/uuid EXISTANT en base
    const id = "eaf5bda4-c2d3-40aa-a7fe-2b09d9d3755f";

    const buffer = await service.returnSignedPDFbyID(id);

    if (buffer === null) {
      console.log("FUA non trouvé pour l'identifiant :", id);
      return;
    }

    console.log("isBuffer:", Buffer.isBuffer(buffer));
    console.log("taille:", buffer.length);
    console.log("aperçu:", buffer.toString("utf-8", 0, 8)); // devrait commencer par %PDF-

    // 3) écris un fichier pour vérifier le rendu
    const outDir = path.resolve(process.cwd(), "tmp");
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);
    const outPath = path.join(outDir, "test-fua.pdf");
    fs.writeFileSync(outPath, buffer);
    console.log("PDF écrit →", outPath);
  } catch (err) {
    console.error("Erreur de test:", err);
  }
})();