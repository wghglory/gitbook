# 核心react代码

```javascript
/*
 * usage: <StarRating totalStars={7} starsSelected={3} />
 */

import React from 'react';
import PropTypes from 'prop-types';

const Star = ({ selected = false, onClick = f => f }) =>
    <div className={(selected) ? "star selected" : "star"}
        onClick={onClick}>
    </div>;

Star.propTypes = {
    selected: PropTypes.bool,
    onClick: PropTypes.func
};

export default class StarRating extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            starsSelected: props.starsSelected
        };
        this.change = this.change.bind(this);
    }

    change(starsSelected) {
        this.setState({ starsSelected });
    }

    render() {
        const { totalStars } = this.props;
        const { starsSelected } = this.state;
        return (
            <div className="star-rating">
                {[...Array(totalStars)].map((n, i) =>
                    <Star key={i}
                        selected={i < starsSelected}
                        onClick={() => this.change(i + 1)}
                    />
                )}
                <p>{starsSelected} of {totalStars} stars</p>
            </div>
        );
    }

}

StarRating.propTypes = {
    totalStars: PropTypes.number,
    starsSelected: PropTypes.number
};

StarRating.defaultProps = {
    totalStars: 5,
    starsSelected: 0
};
```

css代码：

```css
html,
body,
#app {
  height: 100%;
  margin: 0;
  padding: 0;
}

#app {
  display: flex;
  align-items: center;
  justify-content: center;
}

.star-rating {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}

.star {
  cursor: pointer;
  width: 2em;
  height: 2em;
  background-color: grey;
  -webkit-clip-path: polygon(50% 0%, 63% 38%, 100% 38%, 69% 59%, 82% 100%, 50% 75%, 18% 100%, 31% 59%, 0% 38%, 37% 38%);
  clip-path: polygon(50% 0%, 63% 38%, 100% 38%, 69% 59%, 82% 100%, 50% 75%, 18% 100%, 31% 59%, 0% 38%, 37% 38%);
}

.star.selected {
  background-color: red;
}

p {
  flex-basis: 100%;
  text-align: center;
}
```