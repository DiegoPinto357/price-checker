import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { Button } from '@heroui/react';
import Typography from '../../lib/Typography';

const HapticFeedback = () => {
  return (
    <div>
      <Typography variant="h3">Feedback táctil</Typography>

      <Typography variant="h4">Impact</Typography>
      <div className="flex justify-between mb-4">
        <Button
          color="primary"
          onPress={async () => {
            await Haptics.impact({ style: ImpactStyle.Light });
          }}
        >
          Light
        </Button>
        <Button
          color="primary"
          onPress={async () => {
            await Haptics.impact({ style: ImpactStyle.Medium });
          }}
        >
          Medium
        </Button>
        <Button
          color="primary"
          onPress={async () => {
            await Haptics.impact({ style: ImpactStyle.Heavy });
          }}
        >
          Heavy
        </Button>
      </div>

      <Typography variant="h4">Notification</Typography>
      <div className="flex justify-between mb-4">
        <Button
          color="primary"
          onPress={async () => {
            await Haptics.notification({ type: NotificationType.Success });
          }}
        >
          Success
        </Button>
        <Button
          color="primary"
          onPress={async () => {
            await Haptics.notification({ type: NotificationType.Warning });
          }}
        >
          Warning
        </Button>
        <Button
          color="primary"
          onPress={async () => {
            await Haptics.notification({ type: NotificationType.Error });
          }}
        >
          Error
        </Button>
      </div>

      <Typography variant="h4">Selection</Typography>
      <div className="flex justify-between mb-4">
        <Button
          color="primary"
          onPress={async () => {
            await Haptics.selectionStart();
          }}
        >
          Start
        </Button>
        <Button
          color="primary"
          onPress={async () => {
            await Haptics.selectionChanged();
          }}
        >
          Change
        </Button>
        <Button
          color="primary"
          onPress={async () => {
            await Haptics.selectionEnd();
          }}
        >
          End
        </Button>
      </div>
    </div>
  );
};

export default HapticFeedback;
