from reportlab.pdfgen import canvas
c = canvas.Canvas("dummy.pdf")
c.drawString(100, 750, "Patient Name: John Doe")
c.drawString(100, 730, "Diagnosis: Severe chest pain and shortness of breath.")
c.save()
