import { Request, Response} from 'express';
import FUASectionService from '../services/FUASectionService';
import FUAFromVisitService from '../services/FUAFromVisitService';

import { getBrowser } from "../utils/utils";
import FUAFromVisitRouter from '../routes/FUAFromVisitRouter';




const FUAFromVisitController = {

    async create (req: Request, res: Response): Promise<void>  {
        const payload = req.body;
        let newFUAFromVisit = null;
        try {
            newFUAFromVisit = await FUAFromVisitService.create({
                // FUAFromVisit Data
                payload: payload.payload,
                schemaType: payload.schemaType,
                outputType: payload.outputType,
                // FUAFormatFromSchema Identifier
                FUAFormatFromSchemaId: payload.FUAFormatFromSchemaId,
                // Audit Data
                createdBy: payload.createdBy
            });
            res.status(201).json(newFUAFromVisit);    
        } catch (err: any) {
            res.status(500).json({
                error: 'Failed to create FUA From Visit. (Controller)', 
                message: (err as (Error)).message,
                details: (err as any).details ?? null, 
            });
        }       
    },

    async hashSignatureVerification(req: Request, res: Response): Promise<void> {
        try {
            const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
            const file = files?.['pdf']?.[0]; 
            
            if (!process.env.SECRET_KEY) {
                throw new Error("Missing SECRET_KEY environment variable");
                }
            const secretKey: string = process.env.SECRET_KEY;
            console.log(secretKey);

            if (!file) {
            res.status(400).json({ error: "No PDF provided (field 'pdf')." });
            return;
            }
            const result = await FUAFromVisitService.hashSignatureVerification(file.buffer, secretKey);
            res.status(200).json({result: result});

        } catch (err: any) {
            res.status(500).json({
                error: 'Failed to verify the signature of a pdf in FUAFromVisit. (Controller)', 
                message: (err as (Error)).message,
                details: (err as any).details ?? null, 
            });
        }
    },

    async generateSignedPdf(req: Request, res: Response): Promise<void> {
        let answer = '<!doctype html><html lang="fr"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>Formulaire PDF - Modèle</title><style>@page{size:A4;margin:20mm;}body{font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#111;margin:0;padding:0;-webkit-print-color-adjust:exact}.page{box-sizing:border-box;width:210mm;min-height:297mm;padding:18mm}header{text-align:center;margin-bottom:12px}h1{margin:0 0 6px 0;font-size:18px}p.lead{margin:0 0 10px 0;font-size:13px}.section{margin-bottom:14px;border-top:1px solid #ddd;padding-top:10px}.row{display:flex;gap:12px;align-items:center;margin-bottom:8px}.col{flex:1;min-width:0}label{display:block;font-weight:600;margin-bottom:4px;font-size:12px}input[type="text"],input[type="date"],textarea{width:100%;box-sizing:border-box;padding:8px;border:1px solid #aaa;border-radius:3px;font-size:12px;background:#fff}textarea{min-height:80px;resize:vertical}.checkboxes{display:flex;gap:18px;flex-wrap:wrap}.check{display:flex;align-items:center;gap:8px;font-size:13px}input[type="checkbox"]{width:18px;height:18px;margin:0;transform:translateY(-1px);accent-color:#111}.empty-box{display:inline-block;width:220px;min-height:22px;border:1px solid #000;background:#fff;padding:4px 6px;vertical-align:middle}table.simple{width:100%;border-collapse:collapse;margin-top:6px}table.simple th,table.simple td{border:1px solid #bbb;padding:8px;text-align:left;font-size:12px}.signature-row{display:flex;gap:18px;margin-top:12px}.sign-box{flex:1;min-height:70px;border-bottom:1px solid #000}.sign-label{margin-top:6px;font-size:12px}@media print{input,textarea{border:1px solid #000}.page{padding:12mm}a[href]:after{content:""}} </style></head><body><div class="page"><header><h1>Formulaire — Rapport / Autorisation</h1><p class="lead">Document modèle généré pour test. Remplir les champs ci-dessous.</p></header><section class="section"><div class="row"><div class="col"><label for="nom">Nom</label><input id="nom" type="text" placeholder="Nom"/></div><div class="col"><label for="prenom">Prénom</label><input id="prenom" type="text" placeholder="Prénom"/></div><div style="width:140px"><label for="date">Date</label><input id="date" type="date"/></div></div><div class="row"><div class="col"><label for="adresse">Adresse</label><input id="adresse" type="text" placeholder="Rue, code postal, ville"/></div><div style="width:160px"><label for="tel">Tél.</label><input id="tel" type="text" placeholder="+33 ..."/></div></div></section><section class="section"><label for="desc">Description / Objet</label><textarea id="desc" placeholder="Tapez la description ou le contenu ici..."></textarea></section><section class="section"><label>Checklist</label><div class="checkboxes"><div class="check"><input type="checkbox" id="c1"/><label for="c1" style="font-weight:normal;">Élément 1 — vérifié</label></div><div class="check"><input type="checkbox" id="c2"/><label for="c2" style="font-weight:normal;">Élément 2 — OK</label></div><div class="check"><input type="checkbox" id="c3"/><label for="c3" style="font-weight:normal;">Élément 3 — nécessite action</label></div><div class="check"><input type="checkbox" id="c4"/><label for="c4" style="font-weight:normal;">Élément 4 — non applicable</label></div></div></section><section class="section"><label>Informations additionnelles (cases vides ci-dessous — pour remplissage manuel)</label><div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:6px;"><div><div class="empty-box" contenteditable="true"></div><div style="font-size:11px;margin-top:4px;">Champ libre 1</div></div><div><div class="empty-box" contenteditable="true"></div><div style="font-size:11px;margin-top:4px;">Champ libre 2</div></div><div><div class="empty-box" style="width:120px" contenteditable="true"></div><div style="font-size:11px;margin-top:4px;">Réf / Code</div></div></div></section><section class="section"><label>Tableau résumé</label><table class="simple" role="table" aria-label="tableau"><thead><tr><th>N°</th><th>Description</th><th>Quantité</th><th>Observation</th></tr></thead><tbody><tr><td>1</td><td>Article A</td><td style="width:80px"><input type="text" style="width:70px" value=""/></td><td><input type="text" style="width:100%"/></td></tr><tr><td>2</td><td>Article B</td><td><input type="text" style="width:70px" value=""/></td><td><input type="text" style="width:100%"/></td></tr><tr><td>3</td><td>Article C</td><td><input type="text" style="width:70px" value=""/></td><td><input type="text" style="width:100%"/></td></tr></tbody></table></section><section class="section"><div class="signature-row"><div style="flex:1"><div class="sign-box"></div><div class="sign-label">Nom et signature (Demandeur)</div></div><div style="flex:1"><div class="sign-box"></div><div class="sign-label">Nom et signature (Validateur)</div></div></div><div style="margin-top:10px;font-size:11px;"><strong>Observations :</strong><div class="empty-box" style="width:100%;min-height:40px;"></div></div></section><footer style="margin-top:18px;font-size:11px;color:#444;">Document généré — page imprimable A4.</footer></div></body></html>';
        let pdfBytes = null;
        
        try {
        pdfBytes = await FUAFromVisitService.generatePdf(answer);
        const pdfBytesSigned = await FUAFromVisitService.pdfMetadataHashSignature(pdfBytes, "evan");
            
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("X-Content-Type-Options", "nosniff");
        res.setHeader("Content-Disposition", 'inline; filename="pdfsigned.pdf"');
        res.status(200).end(pdfBytesSigned);
    
        } catch (err: any) {
            res.status(500).json({
                error: 'Failed to generate a pdf in FUAFromVisit. (Controller)', 
                message: (err as (Error)).message,
                details: (err as any).details ?? null, 
            });
        }
    },

    // Pending pagination
    async listAll (req: Request, res: Response): Promise<void> {
        try {
            const listFUASection = await FUAFromVisitService.listAll();
            res.status(200).json(listFUASection);
        } catch (err: any) {
            res.status(500).json({
                error: 'Failed to list FUA From Visit. (Controller)', 
                message: (err as (Error)).message,
                details: (err as any).details ?? null, 
            });
        }    
    },

    async getById (req: Request, res: Response): Promise<void> {
        const payload = req.params.id;

        let searchedFUA = null;

        try {
            searchedFUA = await FUAFromVisitService.getByIdOrUUID(payload);
            
            // In case nothing was found 
            if(searchedFUA === null){
                res.status(404).json({
                    error: `FUA From Visit by Id or UUID '${payload}' couldnt be found. `,
                });
                return;
            }

            res.status(200).json(searchedFUA);    
        } catch (err: any) {
            res.status(500).json({
                error: 'Failed to get FUA From Visit. (Controller)', 
                message: (err as (Error)).message,
                details: (err as any).details ?? null, 
            });
        }     
    },

    async addFUAinQueue(req: Request, res: Response): Promise<void>{
        const fuaUUID = req.query.uuid;
        const fuaVisitUUID = req.query.visitUuid;
        try{
            FUAFromVisitService.addFUAinQueue(fuaUUID, fuaVisitUUID);
            res.status(200).json({result : `FUA ${fuaUUID} added in the queue.`});
        }catch (err: any) {
            res.status(500).json({
                error: 'Failed to add a FUA in the Queue. (Controller)', 
                message: (err as (Error)).message,
                details: (err as any).details ?? null, 
            });
        }
    },

    async addFUAinQueueFromDatabase(req: Request, res: Response): Promise<void>{
        const fuaUUID = req.params.id;
        let fuaVisitUUID = null;
        try{
            const fuaFromVisitFromDatabase = await FUAFromVisitService.getByIdOrUUID(fuaUUID as string);
            if (fuaFromVisitFromDatabase === null){
                res.status(404).json({
                    error: `UUID '${fuaUUID}' couldnt be found in the database. `,
                });
            }
            const fuaVisitUUIDPayload = fuaFromVisitFromDatabase.payload;
            const fuaVisitUUIDParse = JSON.parse(fuaVisitUUIDPayload);
            fuaVisitUUID = fuaVisitUUIDParse.uuid;
            await FUAFromVisitService.addFUAinQueue(fuaUUID, fuaVisitUUID);
            
            res.status(200).json({result : `FUA ${fuaUUID} added in the queue.`});
        }catch (err: any) {
            res.status(500).json({
                error: 'Failed to add a FUA in the Queue. (Controller)', 
                message: (err as (Error)).message,
                details: (err as any).details ?? null, 
            });
        }
    },
    
    async removeFUAFromQueue(req: Request, res: Response): Promise<void>{
        const fuaUUID = req.query.uuid;
        try{
            const fuaReference = FUAFromVisitService.removeFUAfromQueue(fuaUUID);
            res.status(200).json({uuid: (await fuaReference).getUUID()});
        }catch (err: any) {
            res.status(500).json({
                error: 'Failed to remove FUA from the Queue. (Controller)', 
                message: (err as (Error)).message,
                details: (err as any).details ?? null, 
            });
        }
    }

};



export default FUAFromVisitController;

