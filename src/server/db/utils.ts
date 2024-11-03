import { parseStringPromise } from "xml2js";
import { env } from "~/env";
import { ParsedProduct, RawProduct } from "~/types/product";

export async function parseXml(xmlURL: string): Promise<any> {
  try {
    const response = await fetch(xmlURL);
    if (!response.ok) {
      throw new Error(`Failed to fetch XML: ${response.statusText}`);
    }

    const xmlData = await response.text();
    const result = await parseStringPromise(xmlData);

    if (typeof result !== "object") {
      throw new Error("Unexpected result from XML parsing");
    }

    return result;
  } catch (error) {
    console.error(
      "Error while parsing XML:",
      error instanceof Error ? error.message : error,
    );
    throw error;
  }
}

export function parseRawXmlToData(rawXml: any): ParsedProduct[] {
  return rawXml.Zamówienie.Artykuly[0].Artykuł.map((product: RawProduct) => {
    const ean = product.$.EAN;
    const name = product.Nazwa[0];
    const categoryName = product.NazwaKategorii[0];
    const color = product.Kolor[0];
    const size = product.Rozmiar[0];
    const quantity = product.Ilość[0] ? parseInt(product.Ilość[0], 10) : 0;
    const available = true;

    return {
      ean,
      name,
      categoryName,
      color,
      size,
      quantity,
      available,
    };
  });
}

export const getXMLProducts = async () => {
  try {
    const rawXmlData = await parseXml(env.XML_URL);
    return parseRawXmlToData(rawXmlData);
  } catch (error) {
    console.error(
      "Error while syncing XML with DB:",
      error instanceof Error ? error.message : error,
    );
    throw error;
  }
};
