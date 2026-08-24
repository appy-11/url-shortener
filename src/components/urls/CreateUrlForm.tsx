import { useState } from 'react'

import Button from '../ui/Button'
import Card from '../ui/Card'
import Input from '../ui/Input'
import Select from '../ui/Select'
import FormError from '../ui/FormError'

import { URL_CONFIG } from '../../config/url.config'
import { APP_CONFIG } from '../../config/app.config'

import type { CreateUrlPayload, ExpiryOption, ShortUrl } from '../../types/url'

import { validateCreateUrl, type CreateUrlErrors } from '../../utils/url.validation'

import { createShortUrl } from '../../services/url.service'
import ShortUrlCard from './ShortUrlCard'

const INITIAL_FORM_DATA: CreateUrlPayload = {
  url: '',
  alias: '',
  expiry: 'never',
}

const CreateUrlForm = () => {
  const [formData, setFormData] = useState<CreateUrlPayload>(INITIAL_FORM_DATA)

  const [errors, setErrors] = useState<CreateUrlErrors>({})

  const [createdUrl, setCreatedUrl] = useState<ShortUrl | null>(null)

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }))

    setErrors((previous) => ({
      ...previous,
      [name]: undefined,
    }))
  }

  const handleExpiryChange = (value: ExpiryOption) => {
    setFormData((previous) => ({
      ...previous,
      expiry: value,
    }))

    setErrors((previous) => ({
      ...previous,
      expiry: undefined,
    }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const validationErrors = validateCreateUrl(formData)

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    try {
      setIsSubmitting(true)

      const result = await createShortUrl(formData)

      setCreatedUrl(result)
    } catch {
      setErrors({
        url: 'Something went wrong. Please try again.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCreateAnother = () => {
    setCreatedUrl(null)
    setFormData(INITIAL_FORM_DATA)
    setErrors({})
  }

  if (createdUrl) {
    return <ShortUrlCard url={createdUrl} onCreateAnother={handleCreateAnother} />
  }

  return (
    <Card>
      <form
        onSubmit={(event) => void handleSubmit(event)}
        className="space-y-5"
        noValidate
      >
        <Input
          id="url"
          name="url"
          label="Long URL"
          type="url"
          placeholder="https://example.com/very/long/url"
          value={formData.url}
          onChange={handleChange}
          error={errors.url}
          required
        />

        <div>
          <label
            htmlFor="alias"
            className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Custom alias
            <span className="ml-1 font-normal text-slate-400 dark:text-slate-500">
              (optional)
            </span>
          </label>

          <div className="flex">
            <span className="flex shrink-0 items-center rounded-l-lg border border-r-0 border-slate-300 bg-slate-50 px-3 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
              {APP_CONFIG.shortUrlDomain}/
            </span>

            <input
              id="alias"
              name="alias"
              type="text"
              placeholder="my-link"
              value={formData.alias}
              onChange={handleChange}
              minLength={URL_CONFIG.alias.minLength}
              maxLength={URL_CONFIG.alias.maxLength}
              aria-invalid={Boolean(errors.alias)}
              aria-describedby={errors.alias ? 'alias-error' : undefined}
              className={`min-w-0 flex-1 rounded-r-lg border px-4 py-3 transition outline-none focus-visible:ring-2 focus-visible:ring-offset-1 ${
                errors.alias
                  ? 'border-red-400 bg-white text-slate-900 placeholder:text-slate-400 focus:border-red-500 focus:ring-red-100 dark:border-red-500 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-600 dark:focus:border-red-400 dark:focus:ring-red-950'
                  : 'border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-slate-500 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-600 dark:focus:border-slate-400 dark:focus:ring-slate-800'
              }`}
            />
          </div>

          <div id="alias-error">
            <FormError message={errors.alias} />
          </div>
        </div>

        <Select
          id="expiry"
          label="Expiry"
          optional
          value={formData.expiry ?? 'never'}
          onChange={handleExpiryChange}
          options={URL_CONFIG.expiryOptions}
        />

        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Short URL'}
        </Button>
      </form>
    </Card>
  )
}

export default CreateUrlForm
