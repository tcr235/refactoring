class Movie {
    /**
     * @type {number}
     */
    static get CHILDREN() { return 2; }

    /**
     * @type {number}
     */
    static get REGULAR() { return 0; }

    /**
     * @type {number}
     */
    static get NEW_RELEASE() { return 1; }

    /**
     * @constructor
     * @param {string} title
     * @param {number} priceCode
     * @return {Movie}
     */
    constructor(title, priceCode) {
        this._title = title;
        this._priceCode = priceCode;
    }

    /**
     * @type {string} 
     */
    get title() { return this._title; }

    /**
     * @type {number}
     */
    get priceCode() { return this._priceCode; }

    /**
     * @param {number} priceCode
     */
    set priceCode(priceCode) {
        this._priceCode = priceCode;
    }
}

class Rental {
    /**
     * @param {Movie} movie
     * @param {number} daysRented
     */
    constructor(movie, daysRented) {
        this._movie = movie;
        this._daysRented = daysRented;
    }

    /**
     * @type {Movie} 
     */
    get movie() { return this._movie; }

    /**
     * @type {number}
     */
    get daysRented() { return this._daysRented; }
    
    /**
    * @return {number}
    */
    getCharge() { // note que não precisa mais de parâmetro!
    let amount = 0;

    switch (this.movie.priceCode) {
        case Movie.REGULAR:
            amount += 2;
            if (this.daysRented > 2) {
                amount += (this.daysRented - 2) * 1.5;
            }
            break;
        case Movie.NEW_RELEASE:
            amount += this.daysRented * 3;
            break;
        case Movie.CHILDREN:
                amount += 1.5;
            if (this.daysRented > 3) {
                amount += (this.daysRented - 3) * 1.5;
            }
            break;
    }

    return amount;
    }
}

class Customer {
    /**
     * @param {string} name
     */
    constructor(name) {
        this._name = name;
        this._rentals = [];
    }

    /**
     * @type {string}
     */
    get name() { return this._name; }

    /**
     * @type {Rental[]}
     */
    get rentals() { return this._rentals; }

    /**
     * @method addRental
     * @param {Rental} rental
     */
    addRental(rental) {
        this._rentals.push(rental);
    }

    amountFor(rental) {
        return rental.getCharge(); // agora apenas delega chamada para método movido
    }

    /**
     * @method statement
     * @return {string}
     */
    statement() {
        let totalAmount = 0;
        let frequentRenterPoints = 0;

        let result = `Rental Record for ${this.name}\n`;

        for (let rental of this.rentals) {
            let thisAmount = rental.getCharge(); // <-- novo método!

            frequentRenterPoints++;

            // add bonus for a two day new release rental
            if (rental.movie.priceCode === Movie.NEW_RELEASE && rental.daysRented > 1) {
                frequentRenterPoints++;
            }

            //show figures for this rental
            result += `\t${rental.movie.title}\t${thisAmount}\n`;
            totalAmount += thisAmount;
        }

        //add footer lines
        result += `Amount owed is ${totalAmount}\nYou earned ${frequentRenterPoints} frequent renter points`;
        return result;
    }
}

function test() {
    const c = new Customer("Alice");

    const m1 = new Movie("Interstellar", Movie.CHILDREN);
    const m2 = new Movie("2001", Movie.REGULAR);
    const m3 = new Movie("Ad Astra", Movie.NEW_RELEASE);

    const r1 = new Rental(m1, 3);
    const r2 = new Rental(m2, 1);
    const r3 = new Rental(m3, 10);

    c.addRental(r1);
    c.addRental(r2);
    c.addRental(r3);

    const actualOutput = c.statement();

    const expectedOutput =
        `Rental Record for Alice\n` +
            `\tInterstellar\t1.5\n` +
            `\t2001\t2\n` +
            `\tAd Astra\t30\n` +
        `Amount owed is 33.5\nYou earned 4 frequent renter points`;

    const testPassed = expectedOutput === actualOutput;

    console.log(testPassed ? "Ok :)" : "Failed :(");

    if (!testPassed) {
        console.log(`Expected output:\n${expectedOutput}\n\n`);
        console.log(`Actual output:\n${actualOutput}\n`);
    }
}

test();