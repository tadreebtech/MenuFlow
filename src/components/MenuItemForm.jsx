import { useEffect, useRef, useState } from 'react'

const emptyItem = {
  name: '',
  category: '',
  description: '',
  price: '',
  available: true,
}

function getInitialValues(item) {
  if (!item) {
    return emptyItem
  }

  return {
    name: item.name,
    category: item.category,
    description: item.description,
    price: String(item.price),
    available: item.available,
  }
}

function validate(values) {
  const errors = {}
  const price = Number(values.price)

  if (!values.name.trim()) {
    errors.name = 'Name is required.'
  }

  if (!values.category.trim()) {
    errors.category = 'Category is required.'
  }

  if (!values.price.trim()) {
    errors.price = 'Price is required.'
  } else if (!Number.isFinite(price) || price <= 0) {
    errors.price = 'Price must be greater than 0.'
  }

  return errors
}

function MenuItemForm({ item, categories, onSubmit, onCancel }) {
  const isEditMode = Boolean(item)
  const [values, setValues] = useState(() => getInitialValues(item))
  const [errors, setErrors] = useState({})
  const formRef = useRef(null)
  const formPanelRef = useRef(null)
  const nameInputRef = useRef(null)

  useEffect(() => {
    nameInputRef.current?.focus({ preventScroll: true })
    formPanelRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }, [])

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target

    setValues((currentValues) => ({
      ...currentValues,
      [name]: type === 'checkbox' ? checked : value,
    }))

    if (errors[name]) {
      setErrors((currentErrors) => ({ ...currentErrors, [name]: '' }))
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const nextErrors = validate(values)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      const firstInvalidField = Object.keys(nextErrors)[0]
      formRef.current?.elements.namedItem(firstInvalidField)?.focus()
      return
    }

    onSubmit({
      name: values.name.trim(),
      category: values.category.trim(),
      description: values.description.trim(),
      price: Number(values.price),
      available: values.available,
    })
  }

  return (
    <section
      id="menu-item-form-panel"
      className="menu-item-form-panel"
      ref={formPanelRef}
      aria-labelledby="item-form-title"
    >
      <div className="form-heading">
        <div>
          <p className="toolbar-kicker">
            {isEditMode ? 'Edit mode' : 'Add mode'}
          </p>
          <h3 id="item-form-title">
            {isEditMode ? `Edit ${item.name}` : 'Add a menu item'}
          </h3>
        </div>
        <button
          className="button button-secondary"
          type="button"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>

      <form
        className="menu-item-form"
        ref={formRef}
        onSubmit={handleSubmit}
        noValidate
      >
        <label className="form-field">
          <span>
            Name <span aria-hidden="true">*</span>
          </span>
          <input
            ref={nameInputRef}
            name="name"
            required
            value={values.name}
            onChange={handleChange}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'name-error' : undefined}
          />
          {errors.name && (
            <small id="name-error" role="alert">
              {errors.name}
            </small>
          )}
        </label>

        <label className="form-field">
          <span>
            Category <span aria-hidden="true">*</span>
          </span>
          <select
            name="category"
            required
            value={values.category}
            onChange={handleChange}
            aria-invalid={Boolean(errors.category)}
            aria-describedby={errors.category ? 'category-error' : undefined}
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {errors.category && (
            <small id="category-error" role="alert">
              {errors.category}
            </small>
          )}
        </label>

        <label className="form-field form-field-wide">
          <span>Description</span>
          <textarea
            name="description"
            value={values.description}
            onChange={handleChange}
            rows="4"
          />
        </label>

        <label className="form-field">
          <span>
            Price <span aria-hidden="true">*</span>
          </span>
          <input
            name="price"
            type="number"
            required
            min="0.01"
            step="0.01"
            value={values.price}
            onChange={handleChange}
            aria-invalid={Boolean(errors.price)}
            aria-describedby={errors.price ? 'price-error' : undefined}
          />
          {errors.price && (
            <small id="price-error" role="alert">
              {errors.price}
            </small>
          )}
        </label>

        <label className="availability-control">
          <input
            name="available"
            type="checkbox"
            checked={values.available}
            onChange={handleChange}
          />
          <span>Available for ordering</span>
        </label>

        <div className="form-actions form-field-wide">
          <button className="button button-primary" type="submit">
            {isEditMode ? 'Save changes' : 'Add item'}
          </button>
          <button
            className="button button-secondary"
            type="button"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </section>
  )
}

export default MenuItemForm
