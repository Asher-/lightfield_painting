class PlusMinus {
  plus: number = 0;
  minus: number = 0;
  constructor( 
    plus: number = 0, 
    minus: number = 0 
  ) {
    this.plus = plus;
    this.minus = minus;
  }

  toString() {
    let details:string[] = [];
    if ( this.plus !== undefined ) {
      details.push( "plus:" + this.plus );
    }
    if ( this.minus !== undefined ) {
      details.push( "minus:" + this.minus );
    }
    
    let string = "(" + details.join(" ") + ")";
    return string;
  }

  duplicate()
  {
    let copy = new PlusMinus;
    copy.plus = this.plus;
    copy.minus = this.minus;
    return copy;
  }
}

export { PlusMinus };