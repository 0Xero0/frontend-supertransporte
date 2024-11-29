import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export function generarPDF( contenido: string) {
  const elemento = document.getElementById(contenido); // Selecciona el elemento a capturar

  if (elemento) {
    const pdf = new jsPDF('p', 'mm', 'a4'); // PDF en formato vertical (A4)
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    html2canvas(elemento).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      // Agrega la primera página
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Agrega más páginas si es necesario
      while (heightLeft > 0) {
        position = heightLeft - imgHeight; // Avanza la posición
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Descarga el PDF
      pdf.save('documento.pdf');
    });
  } else {
    console.error('Elemento no encontrado');
  }
}
