import { Injectable } from '@angular/core';

import { SearchServiceProvider } from '../search-service/search-service';
import { WasteProduct } from '../../models/waste-product.model';

@Injectable()
/**
 * This class deals with actions related to favourited waste products
 */
export class FavouriteServiceProvider {
  favourites: WasteProduct[] = []; // array of favourited waste products
  constructor(private searcher: SearchServiceProvider) {}
  /**
   * Return the list of the user's favourites
   */
  getFavourites(): WasteProduct[] {
    return this.favourites;
  }
  /**
   * Add a waste product to favourites
   * @param wp waste product
   */
  addToFavourites(wpid: string): void {
    let wp = this.searcher.getWasteProductById(wpid);
    if (wp) { // if not null
      this.favourites.push(wp);
    }
  }
  /**
   * Remove a waste product from the favourites list
   * @param wp the waste product to unfavourite
   */
  removeFromFavourites(wpid: string): void {
    for (let i = 0; i < this.favourites.length; i++) {
      if (this.favourites[i].title == wpid || this.favourites[i].id == wpid) {
        // remove the waste product from favourited
        this.favourites = this.favourites.slice(0, i).concat(this.favourites.slice(i + 1, this.favourites.length));
      }
    }
  }

}
