import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

import { FavouriteServiceProvider } from './providers/favourite-service/favourite-service';
import { SearchServiceProvider } from './providers/search-service/search-service';
import { WasteProduct } from './models/waste-product.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
/**
 * This class deals with the main page of the web app and main functionality
 */
export class AppComponent {
  public query: String = ""; // user's input query
  public searchResults: WasteProduct[] = []; // array containing waste products related to an input query
  public favourites: WasteProduct[] = []; // array containing favourited waste products
  public loading: boolean = false; // shows the loading animation
  constructor(private favouriter: FavouriteServiceProvider, private searcher: SearchServiceProvider) {
    // retrieve favourites
    this.favourites = this.favouriter.getFavourites();
  }
  /**
   * Process a form containing search query data
   * @param form form with search query data
   */
  public process(form: NgForm): void {
    if (this.query.length > 0) {
      this.updateSearchResults();
    }
  }
  /**
   * Show a list of search results related to the input query
   */
  public updateSearchResults(): void {
    let domResults = [];
    this.searchResults = [];
    this.loading = true;
    // perform API call in searcher provider, then populate DOM
    this.searcher.fetchWasteProducts().then(() => {
      // find waste products related to the query 
      let wasteProducts = this.searcher.search(this.query);
      // assign colors based on if the product is in favourites or not
      for (let i = 0; i < wasteProducts.length; i++) {
        let color = "rgb(209, 209, 209)";
        this.favourites.forEach((fav) => {
          let fav_id = fav.id ? fav.id : fav.title;
          let searchRes_id = wasteProducts[i].id ? wasteProducts[i].id : wasteProducts[i].title;
          if (fav_id == searchRes_id) {
            color = "rgb(34, 149, 94)";
          }
        });

        domResults.push({
          color: color,
          id: wasteProducts[i].id,
          body: wasteProducts[i].body,
          category: wasteProducts[i].category,
          title: wasteProducts[i].title,
        });
      }
    }).catch(err => console.log(err)).finally(() => {
      this.searchResults = domResults;
      this.loading = false;
    });
  }
  /**
   * Resets the search results when the input query is cleared
   * @param text string to be checked
   */
  public checkInput(text: String): void {
    if (text.length <= 0) {
      this.searchResults = [];
      this.query = "";
    }
  }
  /**
   * Switch a star icon's color between green and gray when clicked on
   * @param wpid waste product id number
   * @param ev a mouse click event
   */
  public toggleFavourite(wpid: string, ev): void {
    let color = ev.target.style.color;
    // color it green
    if (color == "" || color == undefined || color == "rgb(209, 209, 209)") {
      ev.target.style.color = "rgb(34, 149, 94)";
      // add waste product to favourites because it has a green star
      this.favouriter.addToFavourites(wpid);
    }
    // color it gray
    else {
      ev.target.style.color = "rgb(209, 209, 209)";
      // remove waste product from favourites because it has a gray star
      this.removeFavourite(wpid);
    }
  }
  /**
   * Remove a waste product from the favourites array
   * @param wpid waste product id number
   */
  public removeFavourite(wpid: string): void {
    this.favouriter.removeFromFavourites(wpid);
    // refresh the favourites
    this.favourites = this.favouriter.getFavourites();
    // set the star color to gray if the waste product is in the search results
    if (this.isSearchResult(wpid)) {
      document.getElementById(wpid).style.color = "rgb(209, 209, 209)";
    }
  }
  /**
   * Decodes a string containing HTML entities into DOM readable HTML
   * SRC: https://stackoverflow.com/a/7394787/1293256
   * @param html HTML string formatted with HTML entities
   */
  public decodeHtml(html: string): string {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  }
  /**
   * Checks if a search result has a certain waste product id number
   * @param wpid waste product id number
   */
  public isSearchResult(wpid: string): boolean {
    for (let i = 0; i < this.searchResults.length; i++) {
      let id = this.searchResults[i].id ? this.searchResults[i].id : this.searchResults[i].title;
      if (id == wpid) {
        return true;
      }
    }
    return false;
  }
}
