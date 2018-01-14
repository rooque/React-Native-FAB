import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  Animated,
  Easing,
} from 'react-native';
import { Touchable } from './src';
import { noop } from './src/utils';

const sharpEasingValues = {
  entry: Easing.bezier(0.0, 0.0, 0.2, 1),
  exit: Easing.bezier(0.4, 0.0, 0.6, 1),
};

const durationValues = {
  entry: 225,
  exit: 195,
};

const moveEasingValues = {
  entry: Easing.bezier(0.0, 0.0, 0.2, 1),
  exit: Easing.bezier(0.4, 0.0, 1, 1),
};

const styles = StyleSheet.create({
  addButton: {
    borderRadius: 50,
    height: 56,
    width: 56,
    alignItems: 'stretch',
    shadowColor: '#000000',
    shadowOpacity: 0.8,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 0,
    },
    elevation: 2,
  },
  fab_box: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    height: 56,
    width: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
  },
  addButtonInnerView: {
    flex: 1,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default class FAB extends Component {
  static propTypes = {
    buttonColor: PropTypes.string,
    iconTextColor: PropTypes.string,
    onClickAction: PropTypes.func,
    iconTextComponent: PropTypes.element,
    visible: PropTypes.bool,
    snackOffset: PropTypes.number,
  }

  static defaultProps = {
    buttonColor: 'red',
    iconTextColor: '#FFFFFF',
    onClickAction: noop,
    iconTextComponent: <Text>+</Text>,
    visible: true,
    snackOffset: 0,
  };

  state = {
    translateValue: new Animated.Value(0),
    shiftValue: new Animated.Value(0),
  };

  componentDidMount() {
    const { translateValue, shiftValue } = this.state;
    const { visible, snackOffset } = this.props;

    if (visible) {
      translateValue.setValue(0);
    } else {
      translateValue.setValue(100);
    }
    if (snackOffset === 0) {
      shiftValue.setValue(-12);
    } else {
      shiftValue.setValue(-12 - snackOffset);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { translateValue, shiftValue } = this.state;
    const { visible } = this.props;

    if ((nextProps.visible) && (!visible)) {
      Animated.timing(
        translateValue,
        {
          duration: durationValues.entry,
          toValue: 0,
          easing: sharpEasingValues.entry,
          useNativeDriver: true,
        },
      ).start();
    } else if ((!nextProps.visible) && (visible)) {
      Animated.timing(
        translateValue,
        {
          duration: durationValues.exit,
          toValue: 100,
          easing: sharpEasingValues.exit,
          useNativeDriver: true,
        },
      ).start();
    }
    if (nextProps.snackOffset !== this.props.snackOffset) {
      if (nextProps.snackOffset === 0) {
        Animated.timing(
          shiftValue,
          {
            duration: durationValues.exit,
            toValue: -12,
            easing: moveEasingValues.exit,
            useNativeDriver: true,
          },
        ).start();
      } else if (nextProps.snackOffset !== 0) {
        Animated.timing(
          shiftValue,
          {
            duration: durationValues.entry,
            toValue: -12 - nextProps.snackOffset,
            easing: moveEasingValues.entry,
            useNativeDriver: true,
          },
        ).start();
      }
    }
  }

  render() {
    const {
      translateValue, shiftValue,
    } = this.state;
    const {
      onClickAction,
      buttonColor,
      iconTextComponent,
      iconTextColor,
    } = this.props;

    return (
      <Animated.View style={[styles.fab_box, {
        transform: [
          { translateY: shiftValue },
          { translateX: translateValue },
        ]
      }]}>
        <Animated.View
          style={[
            styles.addButton
          ]}
        >
          <Touchable
            onPress={onClickAction}
            style={styles.addButtonInnerView}
            buttonColor={buttonColor}
          >
            <Text
              style={{
                fontSize: 24,
              }}
            >
              {React.cloneElement(iconTextComponent, {
                style: {
                  fontSize: 24,
                  color: iconTextColor,
                }
              })}
            </Text>
          </Touchable>
        </Animated.View>
      </Animated.View>
    );
  }
}

