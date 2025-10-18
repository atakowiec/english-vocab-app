import React, { ReactNode } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Modal from 'react-native-modal';
import { useThemeColors } from '@/hooks/theme/useThemeColor';
import { ThemedText } from '@/components/theme/ThemedText';
import { ModalProps } from "react-native-modal/dist/modal";

export type ThemedModalProps = Partial<ModalProps> & {
  visible: boolean;
  onClose: () => void;
  title?: string | ReactNode;
  children?: ReactNode;
  actions?: ReactNode;
  containerStyle?: ViewStyle;
  allowBackdropClose?: boolean;
};

export default function ThemedModal({
  visible,
  onClose,
  title,
  children,
  actions,
  allowBackdropClose = false,
  animationIn = 'zoomIn',
  animationOut = 'zoomOut',
  containerStyle,
}: ThemedModalProps) {
  const colors = useThemeColors();

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={allowBackdropClose ? onClose : undefined}
      animationIn={animationIn}
      animationOut={animationOut}
    >
      <View style={[styles.modal, { backgroundColor: colors.background_blue_2 }, containerStyle]}>
        {title ? (
          typeof title === 'string' ? (
            <ThemedText type="subtitle" style={styles.title}>
              {title}
            </ThemedText>
          ) : (
            <View style={styles.titleWrapper}>{title}</View>
          )
        ) : null}

        <View>
          {children}
        </View>

        {actions ? <View style={styles.actions}>{actions}</View> : null}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: { padding: 20, borderRadius: 16 },
  title: { marginBottom: 12 },
  titleWrapper: { marginBottom: 12 },
  actions: { marginTop: 16 },
});
