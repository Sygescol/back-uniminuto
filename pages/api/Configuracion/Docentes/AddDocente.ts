import type { NextApiRequest, NextApiResponse } from "next";
import connectionPool from "../../../../config/db";

type Data = {};

type ErrorData = {
  body: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | ErrorData>
) {
  if (req.method !== "POST") {
    res.status(405).json({ body: "Method Not Allowed" });
    return;
  }
  try {
    const {
      IdSubSede,
      Nombre,
      Apellidos,
      TipoDocumento,
      NumeroDocumento,
      Genero,
      Correo,
    } = req.body;

    const [VerificarExistencia]: any = await connectionPool.query(
      `SELECT usuario.id FROM usuario INNER JOIN dcne ON dcne.i=usuario.idUsuario WHERE dcne.dcne_num_docu='${NumeroDocumento}' OR usuario.login LIKE '${
        Nombre?.split(" ")[0]?.replace(/\s+/g, " ").trim()?.toLowerCase() || ""
      }${
        Apellidos?.split(" ")[0]?.replace(/\s+/g, " ").trim()?.toLowerCase() ||
        ""
      }'
      `
    );
    if (VerificarExistencia.length > 0) {
      res.status(400).json({ body: "El Profesor ya existe" });
      return;
    }

    const [ProfesorAdd]: any = await connectionPool.query(`
    INSERT INTO dcne (dcne_ape1, dcne_ape2, dcne_nom1, dcne_nom2, dcne_num_docu, tipo_docu_id,dcne_genero,dcne_email_perso,subSedeId) values ('${
      Apellidos?.split(" ")[0]?.toUpperCase() || ""
    }', '${Apellidos?.split(" ")[1]?.toUpperCase() || ""}', '${
      Nombre?.split(" ")[0]?.toUpperCase() || ""
    }', '${
      Nombre?.split(" ")[1]?.toUpperCase() || ""
    }','${NumeroDocumento}','${TipoDocumento}','${Genero}','${Correo}','${IdSubSede}')
    `);

    if (ProfesorAdd.affectedRows === 0) {
      res.status(400).json({ body: "No se puedo agregar el Profesor" });
      return;
    }

    const [AddUser]: any = await connectionPool.query(`
    INSERT INTO usuario (login, pass, rol, tipo, idUsuario,subsede) values ('${
      Nombre?.split(" ")[0]?.replace(/\s+/g, " ").trim()?.toLowerCase() || ""
    }${
      Apellidos?.split(" ")[0]?.replace(/\s+/g, " ").trim()?.toLowerCase() || ""
    }', '${NumeroDocumento}', '2', 'PROFESOR', '${
      ProfesorAdd.insertId
    }','${IdSubSede}')`);

    if (AddUser.affectedRows === 0) {
      res
        .status(400)
        .json({ body: "No se puedo agregar el usuario del profesor" });
      return;
    }

    res.status(200).json({
      body: "Profesor agregado correctamente",
    } as Data);
  } catch (error) {
    console.log(error);

    res.status(500).json({ body: "Internal server error" } as ErrorData);
  }
}
