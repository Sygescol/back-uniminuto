import type { NextApiRequest, NextApiResponse } from "next";
import connectionPool from "../../../../config/db";
import { Administrativo } from "../../../../typings";

type Data = {
  administrativos: Administrativo[];
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
    console.log(SubSede);

    const [AdministrativosRes]: any = await connectionPool.query(
      `select admco.id as Id,concat(admco.admco_nom1,' ',admco.admco_nom2) as Nombre,concat(admco.admco_ape1,' ',admco.admco_ape2) as Apellidos,admco.documento as Documento, admco.cargo as Cargo,admco.mail as Correo,admco.imagen as Imagen,usuario.login Usuario, usuario.pass as Pass,admco.tipo_documento as TipoDocumento,genero as Genero, usuario.rol as TipoUsuario,subSedes.nombre as NombreSubSede from admco INNER JOIN usuario ON(admco.id=usuario.idUsuario)  INNER JOIN subSedes ON subSedes.id=usuario.subsede WHERE usuario.tipo LIKE  'ADMINISTRATIVO' ${
        SubSede && SubSede != "0" ? `and usuario.subsede = '${SubSede}'` : ""
      }
      `
    );

    res.status(200).json({ administrativos: AdministrativosRes || [] } as Data);
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
