export class WasteProduct {
    body: string;
    category: string;
    title: string;
    keywords: string;
    id: string;
    constructor(body: string, category: string, title: string, keywords: string, id: string) {
        this.body = body;
        this.category = category;
        this.title = title;
        this.keywords = keywords;
        this.id = id;
    }
}