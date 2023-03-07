const SavePdf = async (
  pdf: any,
  Documento: any,
  url: string,
  TipoArchivo: string,
  Seccion: string
) => {
  try {
    const reader = new FileReader();
    reader.onload = async (e: any) => {
      const data = new FormData();
      data.append("file", pdf);
      data.append("documento", Documento);
      data.append("tipoArchivo", TipoArchivo);

      const response = await fetch(url, {
        method: "POST",
        body: data,
      });
      const result = await response.json();
      console.log("Success:", result);
      if (result.status) {
        const SaveInfoPdfDB = await fetch("/api/Formulario/Save/SaveFile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            documento: Documento,
            pdf: result,
            TipoArchivo: TipoArchivo,
            SeccionFormulario: Seccion,
          }),
        }).then((res) => res.json());
      }
    };
    reader.readAsBinaryString(pdf);
  } catch (error) {}
};
export { SavePdf };
