# UI Components

Les composants de base `Button`, `TextInput` et `Card` se trouvent dans `src/components/ui/`.

```jsx
import Button from '../components/ui/Button';
import TextInput from '../components/ui/TextInput';
import Card from '../components/ui/Card';
```

## Button

```jsx
<Button variant="primary" size="md" onClick={handleClick}>
  Valider
</Button>
```

Variants disponibles : `primary`, `secondary`, `outline`, `danger`. Les tailles disponibles : `sm`, `md`, `lg`.

## TextInput

```jsx
<TextInput
  label="Email"
  type="email"
  value={email}
  onChange={e => setEmail(e.target.value)}
  error={errorMsg}
/>
```

## Card

```jsx
<Card className="p-4">
  Contenu...
</Card>
```
