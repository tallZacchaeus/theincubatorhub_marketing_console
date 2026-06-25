import { SelectField, TextField } from '@/components/form/fields';
import { LINK_TYPE_OPTIONS } from '@/content/linkTypes';

/*
 * Shared tracked-link form fields (destination, type, label, UTM), used inside a
 * react-hook-form <Form>. Reused by the campaign detail add-link form and the
 * standalone Tracked Links page so both stay consistent. The parent owns layout
 * (grid vs stacked) and the submit button.
 */
export default function LinkFormFields() {
  return (
    <>
      <TextField name="destination_url" label="Destination URL" placeholder="https://incubatorhub.com/apply" />
      <SelectField
        name="link_type"
        label="What's this link for?"
        options={LINK_TYPE_OPTIONS}
        hint="How you'll group this link's clicks in analytics."
      />
      <TextField name="label" label="Label" placeholder="Optional" />
      <TextField name="utm_source" label="utm_source" placeholder="Optional" hint="Optional tags for your own reporting." />
      <TextField name="utm_medium" label="utm_medium" placeholder="Optional" />
      <TextField name="utm_campaign" label="utm_campaign" placeholder="Optional" />
    </>
  );
}
