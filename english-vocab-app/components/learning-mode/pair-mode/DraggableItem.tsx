import React, {useEffect, useRef, useState} from 'react';
import {Animated, PanResponder, StyleSheet, useWindowDimensions} from 'react-native';
import {useThemeColors} from "@/hooks/theme/useThemeColor";
import {WordType} from "@/context/GlobalLearningContext";
import FontAwesome from "@expo/vector-icons/FontAwesome";

type DraggableItemProps = {
  item: WordType;
  onDrop: (id: number, x: number, y: number) => void;
  pan: Animated.ValueXY;
  revealAnswer: boolean;
  valid: boolean;
}

const DraggableItem = ({item, onDrop, pan, revealAnswer, valid}: DraggableItemProps) => {
  const {width} = useWindowDimensions()
  const colors = useThemeColors();

  const animatedPadding = useRef(new Animated.Value(0)).current;
  const iconOpacity = useRef(new Animated.Value(0)).current;
  const [displayedState, setDisplayedState] = useState<null | boolean>(null);
  const [isDragging, setIsDragging] = useState(false);
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let isCancelled = false;

    if (revealAnswer) {
      setDisplayedState(valid);
      Animated.parallel([
        Animated.timing(animatedPadding, {
          toValue: 25,
          duration: 250,
          useNativeDriver: false,
        }),
        Animated.timing(iconOpacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(animatedPadding, {
          toValue: 0,
          duration: 250,
          useNativeDriver: false,
        }),
        Animated.timing(iconOpacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start(() => {
        if (!isCancelled) {
          setDisplayedState(null);
        }
      });
    }

    return () => {
      isCancelled = true;
    }
  }, [revealAnswer, valid]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setIsDragging(true);
        Animated.spring(scale, {
          toValue: 1.1,
          useNativeDriver: false,
        }).start();
        // @ts-ignore
        pan.setOffset({
          // @ts-ignore
          x: pan.x._value,
          // @ts-ignore
          y: pan.y._value
        });
        pan.setValue({x: 0, y: 0});
      },
      onPanResponderMove: Animated.event(
        [null, {dx: pan.x, dy: pan.y}],
        {useNativeDriver: false}
      ),
      onPanResponderTerminate: () => {
        setIsDragging(false);
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: false,
        }).start();
        pan.flattenOffset();
      },
      onPanResponderRelease: () => {
        setIsDragging(false);
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: false,
        }).start();
        pan.flattenOffset();
        // @ts-ignore
        const dropX = pan.x.__getValue();
        // @ts-ignore
        const dropY = pan.y.__getValue();

        onDrop(item.word.id, dropX, dropY);
      },
    })
  ).current;

  return (
    <Animated.View
      style={[
        pan.getLayout(),
        styles.draggableItem,
        {
          backgroundColor: colors.background_blue_3,
          width: width / 2 - 15,
          zIndex: isDragging ? 1000 : 10,
          transform: [{scale}]
        }
      ]}
      {...panResponder.panHandlers}
    >
      {displayedState !== null && (
        <Animated.View style={[styles.icon, {opacity: iconOpacity}]}>
          {displayedState && <FontAwesome name="check" size={24} color="green"/>}
          {!displayedState && <FontAwesome name="remove" size={24} color="red"/>}
        </Animated.View>
      )}
      <Animated.Text
        style={{textAlign: "center", paddingLeft: animatedPadding, fontSize: 16, color: colors.text_secondary}}
        numberOfLines={1}>
        {item.language == "en" ? item.word.word_pl : item.word.word_en}
      </Animated.Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  draggableItem: {
    position: 'absolute',
    height: 50,
    padding: 15,
    backgroundColor: '#007AFF',
    borderRadius: 15,
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    position: 'absolute',
    top: 12,
    left: 10,
    zIndex: 100,
  }
});

export default DraggableItem;