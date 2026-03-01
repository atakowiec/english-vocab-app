import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  HostInstance,
  PanResponder,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  Vibration,
  View
} from 'react-native';
import DraggableItem from './DraggableItem';
import {ThemedText} from "@/components/theme/ThemedText";
import {useThemeColors} from "@/hooks/theme/useThemeColor";
import {WordType} from "@/context/GlobalLearningContext";
import {ThemedView} from "@/components/theme/ThemedView";

type DragDropBoardProps = {
  words: WordType[]
}

type ItemDataType = {
  initialPosition: { x: number, y: number };
  word: WordType;
  dropZoneIndex: number | null;
  animatedValue: Animated.ValueXY;
}

const DragDropBoard = ({words}: DragDropBoardProps) => {
  const colors = useThemeColors();
  const {width, height} = useWindowDimensions()
  const dropZonesRef = useRef<Record<number, { x: number, y: number, width: number, height: number }>>({})
  const containerRef = useRef<View>(null)
  const zoneRefs = useRef<Record<number, View | null>>({})

  const leftBoxRefs = useRef<Record<number, View | null>>({});

  const [itemsData, setItemsData] = useState<Record<number, ItemDataType>>({}) // word id -> item data

  const [revealAnswer, setRevealAnswer] = useState(false);

  const [previewWord, setPreviewWord] = useState<WordType | null>(null);
  const previewWordRef = useRef<WordType | null>(null);

  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponderCapture: () => previewWordRef.current !== null,
      onMoveShouldSetPanResponderCapture: () => previewWordRef.current !== null,
      onStartShouldSetPanResponder: () => previewWordRef.current !== null,
      onMoveShouldSetPanResponder: () => previewWordRef.current !== null,
      onPanResponderRelease: () => {
        setPreviewWord(null);
        previewWordRef.current = null;
      },
      onPanResponderTerminate: () => {
        setPreviewWord(null);
        previewWordRef.current = null;
      },
    })
  ).current;

  useEffect(() => {
    setItemsData(words.reduce((acc, word, index) => {
      acc[word.word.id] = {
        word,
        dropZoneIndex: null,
        initialPosition: getInitialPosition(index),
        animatedValue: new Animated.ValueXY(getInitialPosition(index)),
      };

      return acc;
    }, {} as Record<number, ItemDataType>))
  }, []);

  useEffect(() => {
    setRevealAnswer(Object.values(itemsData).length > 0 && Object.values(itemsData).every(item => item.dropZoneIndex != null))
  }, [itemsData]);

  const handleDropZoneLayout = (index: number) => {
    zoneRefs.current[index]?.measureLayout(
      containerRef.current as HostInstance,
      (x, y, width, height) => {
        dropZonesRef.current[index] = {x, y, width, height};
      },
      () => {
        console.error("Failed to measure layout for drop zone", index);
      }
    );
  };

  const handleDrop = (itemId: number, dropX: number, dropY: number) => {
    const zones = Object.entries(dropZonesRef.current).map(([index, zone]) => ({
      index: parseInt(index),
      ...zone
    }));

    const draggedItem = itemsData[itemId];
    if (!draggedItem) return;

    const dropZone = zones.find(zone => {
      const {x, y, width, height} = zone;

      const midX = dropX + width / 2;
      const midY = dropY + height / 2;

      return midX >= x && midX <= x + width && midY >= y && midY <= y + height;
    });

    // no drop zone → return to the start position
    if (!dropZone) {
      Animated.spring(draggedItem.animatedValue, {
        toValue: draggedItem.initialPosition,
        useNativeDriver: false,
      }).start();

      // update dropZoneIndex to null
      setItemsData(prev => ({
        ...prev,
        [itemId]: {
          ...prev[itemId],
          dropZoneIndex: null,
        }
      }));

      return;
    }

    Vibration.vibrate(30);
    const dropZoneIndex = dropZone.index;

    setItemsData(prev => {
      const prevLocation = prev[itemId];
      const next = {...prev};

      // Move the dragged item into a new slot
      next[itemId] = {
        ...prev[itemId],
        dropZoneIndex,
      };

      // Check if someone already occupies this slot
      const occupyingEntry = Object.values(prev).find(
        (itemData) => itemData.word.word.id !== itemId && itemData.dropZoneIndex === dropZoneIndex
      );

      if (!occupyingEntry) {
        Animated.spring(draggedItem.animatedValue, {
          toValue: {x: dropZone.x, y: dropZone.y},
          useNativeDriver: false,
        }).start();

        return next;
      }

      const otherId = occupyingEntry.word.word.id;
      const otherItem = prev[otherId];
      if (!otherItem) return next;

      // Perform swap: move the occupying item to the dragged item's previous location
      next[otherId] = {
        ...otherItem,
        dropZoneIndex: prevLocation.dropZoneIndex,
      };

      // Animate dragged item
      Animated.spring(draggedItem.animatedValue, {
        toValue: {x: dropZone.x, y: dropZone.y},
        useNativeDriver: false,
      }).start();

      // Animate swapped item
      if (prevLocation.dropZoneIndex === null) {
        Animated.spring(otherItem.animatedValue, {
          toValue: otherItem.initialPosition,
          useNativeDriver: false,
        }).start();
      } else {
        const targetZone = dropZonesRef.current[prevLocation.dropZoneIndex];
        if (targetZone) {
          Animated.spring(otherItem.animatedValue, {
            toValue: {x: targetZone.x, y: targetZone.y},
            useNativeDriver: false,
          }).start();
        }
      }

      return next;
    });
  };

  function getInitialPosition(index: number) {
    return {
      x: 10 + (index % 2 * (width / 2 - 7)),
      y: height - 300 + (index > 1 ? 60 : 0)
    }
  }

  function onWordLongPress(word: WordType) {
    Vibration.vibrate(50);
    setPreviewWord(word);
    previewWordRef.current = word;
  }

  return (
    <View ref={containerRef}
          style={styles.container}
          {...pan.panHandlers}>
      <View style={styles.rowsContainer}>
        {words.map((word, index) => (
          <View key={word.word.id} style={styles.row}>
            <TouchableOpacity
              ref={(ref) => (leftBoxRefs.current[index] = ref as any)}
              style={[styles.leftBox, {backgroundColor: colors.background_blue_2}]}
              onLongPress={() => onWordLongPress(word)}
              activeOpacity={0.8}
            >
              <ThemedText colorKey={"text_secondary"} style={{textAlign: "center"}} numberOfLines={2}>
                {word.language === "en" ? word.word.word_en : word.word.word_pl}
              </ThemedText>
            </TouchableOpacity>
            <View ref={(ref) => (zoneRefs.current[index] = ref as any)}
                  style={[styles.dropZone, {backgroundColor: colors.background_blue_3}]}
                  onLayout={() => handleDropZoneLayout(index)}>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.bottomArea}>
      </View>

      {Object.values(itemsData).map((option) => (
        <DraggableItem
          key={option.word.word.id}
          item={option.word}
          onDrop={handleDrop}
          pan={option.animatedValue}
          revealAnswer={revealAnswer}
          valid={option.dropZoneIndex != null && option.word.word.id == words[option.dropZoneIndex].word.id}
        />
      ))}
      {previewWord && (
        <ThemedView style={[styles.previewBox, {borderColor: colors.accent_blue}]} colorKey={"background_blue_2"}>
          <ThemedText type={"title"}>
            {previewWord.language === 'en' ? previewWord.word.word_en : previewWord.word.word_pl}
          </ThemedText>
          <ThemedText type={"subtitle"} colorKey={"text_secondary"}>
            Definition:
          </ThemedText>
          <ThemedText type={"small"} colorKey={"text_secondary"}>
            {previewWord.word.definition_en}
          </ThemedText>
          {previewWord.word.examples.length > 0 && (
            <>
              <ThemedText type={"subtitle"} colorKey={"text_secondary"}>
                {previewWord.word.examples.length > 1 ? "Examples:" : "Example:"}
              </ThemedText>
              {previewWord.word.examples.map(example => (
                <ThemedText key={example} type={"small"} colorKey={"text_secondary"}>
                  - {example}
                </ThemedText>
              ))}
            </>
          )}
        </ThemedView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  rowsContainer: {flex: 2, padding: 10, gap: 8, justifyContent: "center"},
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  leftBox: {
    flex: 1,
    height: 50,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropZone: {
    flex: 1,
    height: 50,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
  },
  bottomArea: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  previewBox: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    padding: 15,
    borderRadius: 15,
    justifyContent: 'center',
    zIndex: 1000,
    gap: 10,
    shadowColor: '#000',
    borderWidth: 1
  }
});

export default DragDropBoard;