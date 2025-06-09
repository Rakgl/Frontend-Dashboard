export const rules = {
    required: (value: string) => !!value || 'Required.',
    email: (value: string) => /.+@.+\..+/.test(value) || 'Invalid email.',
    minLength: (min: number) => (value: string) => value.length >= min || `Must be at least ${min} characters.`,
    maxLength: (max: number) => (value: string) => value.length <= max || `Must be at most ${max} characters.`,
}