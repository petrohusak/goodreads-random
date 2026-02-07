declare module 'react-xml-parser' {
  export interface XMLNode {
    name: string;
    attributes: { [key: string]: string };
    children: XMLNode[];
    value: string;
    // This is the missing piece:
    getElementsByTagName(tagName: string): XMLNode[];
    getChildElements(): XMLNode[];
  }

  export default class XMLParser {
    parseFromString(xml: string): XMLNode;
  }
}
