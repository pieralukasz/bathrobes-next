import xl from "excel4node";
import { orderQueries } from "~/server/db/queries";

export type OrderWithDetails = NonNullable<
  Awaited<ReturnType<typeof orderQueries.getOrderByIdAndUserId>>
>;

export const generateOrderExcel = (order: OrderWithDetails) => {
  const wb = new xl.Workbook();
  const ws = wb.addWorksheet("zamowienie");

  const styleHeadline = wb.createStyle({
    font: { bold: true, size: 12 },
  });

  const styleOrder = wb.createStyle({
    font: { size: 12, color: "#010236" },
  });

  // Set headers
  ws.cell(1, 1).string("ID.").style(styleHeadline);
  ws.cell(1, 2).string("Nazwa").style(styleHeadline);
  ws.cell(1, 3).string("Kolor").style(styleHeadline);
  ws.cell(1, 4).string("Rozmiar").style(styleHeadline);
  ws.cell(1, 5).string("Ilosc").style(styleHeadline);

  // Fill data
  order.items.forEach((item, index) => {
    const row = index + 2;
    ws.cell(row, 1)
      .number(index + 1)
      .style(styleOrder);
    ws.cell(row, 2)
      .string(item.productSize.color.product.name)
      .style(styleOrder);
    ws.cell(row, 3).string(item.productSize.color.color).style(styleOrder);
    ws.cell(row, 4).string(item.productSize.size).style(styleOrder);
    ws.cell(row, 5).number(item.quantity).style(styleOrder);
  });

  return wb.writeToBuffer();
};
