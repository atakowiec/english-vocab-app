import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useThemeColors } from '@/hooks/theme/useThemeColor';
import ThemedButton from '@/components/theme/ThemedButton';
import { ThemedText } from '@/components/theme/ThemedText';
import ThemedModal from '@/components/Modal';

type Props = {
  isVisible: boolean;
  setVisible: (visible: boolean) => void;
  onClose?: () => void;
  onSubmit?: (reason: string) => void;
};

export default function ReportModal({ isVisible, setVisible, ...props }: Props) {
  const colors = useThemeColors();
  const [reason, setReason] = useState<string | null>(null);

  const reasons = ['Spam', 'Offensive content', 'Incorrect information', 'Other']; // some day we will move this somewhere else

  function close() {
    setVisible(false);
    setReason(null);
    props.onClose?.();
  }

  function submit() {
    if (reason) {
      props.onSubmit?.(reason);
    }

    close();
  }

  return (
    <ThemedModal
      visible={isVisible}
      onClose={() => setVisible(false)}
      title="Report reason"
    >
      {reasons.map((r) => (
        <TouchableOpacity
          key={r}
          onPress={() => setReason(r)}
          activeOpacity={0.8}
          style={[
            styles.optionRow,
            { backgroundColor: colors.background_blue_3, borderWidth: 2, borderColor: colors.background_blue_3 },
            reason === r && { borderColor: colors.accent_blue },
          ]}
        >
          <ThemedText
            type={reason === r ? 'defaultSemiBold' : 'default'}
            colorKey={reason === r ? 'accent_blue' : 'text_secondary'}
            style={styles.option}
          >
            {r}
          </ThemedText>
        </TouchableOpacity>
      ))}

      <View style={styles.actions}>
        <ThemedButton
          type="secondary"
          size={'medium'}
          onPress={close}
          style={[styles.actionButton, { marginRight: 12, backgroundColor: colors.background_blue_3 }]}
        >
          Cancel
        </ThemedButton>
        <ThemedButton
          onPress={submit}
          size={'medium'}
          disabled={!reason}
          style={styles.actionButton}
        >
          Submit
        </ThemedButton>
      </View>
    </ThemedModal>
  );
}

const styles = StyleSheet.create({
  optionRow: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 20, marginVertical: 6 },
  option: { fontSize: 15 },
  actions: { flexDirection: 'row', marginTop: 16 },
  actionButton: { flex: 1, alignItems: 'center' },
});
