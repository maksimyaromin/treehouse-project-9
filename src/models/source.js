
export class Photo {
    constructor({ id, farm, owner, secret, server, title }) {
        this.id = id;
        this.farm = farm;
        this.owner = owner;
        this.secret = secret;
        this.server = server;
        this.title = title;
    }
    get link() {
        return `https://farm${this.farm}.staticflickr.com/${this.server}/${this.id}_${this.secret}.jpg`;
    }
};

class Source {
    constructor({ page, pages, perpage: count, photo: data }) {
        this.page = page;
        this.pages = pages;
        this.count = count;
        this.hasImages = !!data;
        if(this.hasImages) {
            this.images = data.map(imageDTO => new Photo(imageDTO));
        }
    }
};

export default Source;