import type { NextApiRequest, NextApiResponse } from "next";
import connectionPool from "../../../../config/db";
import { Docente } from "../../../../typings";

type Data = {
  docentes: Docente[];
};

type ErrorData = {
  body: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | ErrorData>
) {
  if (req.method !== "GET") {
    res.status(405).json({ body: "Method Not Allowed" });
    return;
  }
  try {
    const { SubSede } = req.query;
    console.log(req.query);

    const [DocentesRes]: any = await connectionPool.query(`
    SELECT dcne.i as Id, concat(dcne.dcne_nom1,' ',dcne.dcne_nom2) as Nombre, concat(dcne.dcne_ape1,' ',dcne.dcne_ape2) as Apellidos,tipo_docum.codigo as DocumCodigo,tipo_docum.nombre as TipoDocumento,dcne.dcne_num_docu as Documento,dcne_email_perso as Correo,usuario.login as Usuario,usuario.pass as Pass,dcne.dcne_genero as Genero,subSedes.nombre as NombreSubSede from dcne INNER JOIN usuario on(usuario.idUsuario=dcne.i) INNER JOIN tipo_docum ON (tipo_docum.id=dcne.tipo_docu_id) INNER JOIN subSedes ON subSedes.id=usuario.subsede WHERE usuario.rol=2 ${
      SubSede && SubSede != "0" ? `and usuario.subsede = '${SubSede}'` : ""
    } order by dcne_ape1,dcne_ape2,dcne_nom1,dcne_nom2
      `);

    res.status(200).json({ docentes: DocentesRes } as Data);
  } catch (error) {
    console.log(error);

    res.status(500).json({ body: "Internal server error" } as ErrorData);
  }
}

export const config = {
  api: {
    responseLimit: false,
  },
};
