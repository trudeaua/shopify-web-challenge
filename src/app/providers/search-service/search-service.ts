import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import 'rxjs/Rx';

import { WasteProduct } from '../../models/waste-product.model';

@Injectable()
/**
 * This class deals with API calls and waste product accessors
 */
export class SearchServiceProvider {
    apiUrl = "https://secure.toronto.ca/cc_sr_v1/data/swm_waste_wizard_APR?limit=1000"; // request URL
    wpData: WasteProduct[] = []; // array of waste products for the API call to populate
    constructor(private http: HttpClient) { }
    /**
     * Find waste products by matching a query with a waste product's keywords and title
     * @param query search query
     */
    public search(query: String): WasteProduct[] {
        let results: WasteProduct[] = [];
        // search the data
        for (let i = 0; i < this.wpData.length; i++) {
            let kwds = this.wpData[i].keywords;
            let title = this.wpData[i].title;
            // if the query is found in the keywords for a waste product, add the waste product to the results
            if (kwds.includes(query.toLocaleLowerCase()) || title.includes(query.toLocaleLowerCase())) {
                results.push(this.wpData[i]);
            }
        }
        return results;
    }
    /**
     * Perform an API call to get the waste product data
     */
    public fetchWasteProducts(): Promise<void> {
        return new Promise(resolve => {
            this.http.get(this.apiUrl).subscribe((res: WasteProduct[]) => {
                this.wpData = res;
                resolve(); // promise resolves when 
            });
        });
    }
    /**
     * Return a waste product by its id number
     * @param wpid waste product id number
     */
    public getWasteProductById(wpid: string): WasteProduct {
        for (let i = 0; i < this.wpData.length; i++) {
            if (this.wpData[i].title == wpid || this.wpData[i].id == wpid) {
                return this.wpData[i];
            }
        }
        return null;
    }

}
