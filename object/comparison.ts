
class Comparison {
  less_than?: number;
  greater_than?: number;
  equal_to: boolean = false;
  
  compare(
    compare_to: number
  ) : boolean
  {
    if ( this.less_than !== undefined ) {
      return this.compareLessThanOrLessThanEqualTo( compare_to );
    }
    else 
      return this.compareGreater( compare_to );
  }

  compareGreater(
    compare_to: number
  ) : boolean
  {
    if ( this.greater_than !== undefined ) {
      return this.compareGreaterThanOrGreaterThanEqualTo( compare_to );
    }
    else {
      return true;
    }
  }

  compareLessThanOrLessThanEqualTo(
    compare_to: number
  ) : boolean
  {
    if ( this.equal_to ) {
      return this.compareLessThanEqualTo( compare_to );
    }
    else {
      return this.compareLessThanEqualTo( compare_to );
    }
  }

  compareLessThan(
    compare_to: number
  ) : boolean
  {
    return compare_to < this.less_than;
  }

  compareLessThanEqualTo(
    compare_to: number
  ) : boolean
  {
    return compare_to <= this.less_than;
  }

  compareGreaterThanOrGreaterThanEqualTo(
    compare_to: number
  ) : boolean
  {
    if ( this.equal_to ) {
      return this.compareGreaterThanEqualTo( compare_to );
    }
    else {
      return this.compareGreaterThan( compare_to );
    }
  }

  compareGreaterThan(
    compare_to: number
  ) : boolean
  {
    return compare_to > this.greater_than;
  }

  compareGreaterThanEqualTo(
    compare_to: number
  ) : boolean
  {
    return compare_to >= this.greater_than;
  }
  toString()
  {
    if ( this.less_than !== undefined ) {
      return this.toStringLessThan();
    }
    else if ( this.greater_than !== undefined ) {
      return this.toStringGreaterThan();
    }
  }

  toStringLessThan()
  {
    let parts = [];
    if ( this.equal_to ) {
      parts.push( '≤ ' + this.less_than.toString() );
    }
    else {
      parts.push( '< ' + this.less_than.toString() );
    }
    let string = '(' + parts.join('') + ')';
    return string;  
  }

  toStringGreaterThan()
  {
    let parts = [];
    if ( this.equal_to ) {
      parts.push( '≥ ' + this.greater_than.toString() );
    }
    else {
      parts.push( '> ' + this.greater_than.toString() );
    }
    let string = '(' + parts.join('') + ')';
    return string;
  }

}

export { Comparison };
