import { useState } from "react";

import Button from "../ui/Button";
import Card from "../ui/Card";
import Input from "../ui/Input";
import Select from "../ui/Select";
import FormError from "../ui/FormError";

import { URL_CONFIG } from "../../config/url.config";
import { APP_CONFIG } from "../../config/app.config";

import type {
  CreateUrlPayload,
  ShortUrl,
} from "../../types/url";

import {
  validateCreateUrl,
  type CreateUrlErrors,
} from "../../utils/url.validation";

import { createShortUrl } from "../../services/url.service";
import ShortUrlCard from "./ShortUrlCard";

const INITIAL_FORM_DATA: CreateUrlPayload = {
  url: "",
  alias: "",
  expiry: "never",
};

const CreateUrlForm = () => {
  const [formData, setFormData] =
    useState<CreateUrlPayload>(INITIAL_FORM_DATA);

  const [errors, setErrors] =
    useState<CreateUrlErrors>({});

  const [createdUrl, setCreatedUrl] =
    useState<ShortUrl | null>(null);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: undefined,
    }));
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const validationErrors =
      validateCreateUrl(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setIsSubmitting(true);

      const result = await createShortUrl(formData);

      setCreatedUrl(result);
    } catch {
      setErrors({
        url: "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateAnother = () => {
    setCreatedUrl(null);
    setFormData(INITIAL_FORM_DATA);
    setErrors({});
  };

  if (createdUrl) {
    return (
      <ShortUrlCard
        url={createdUrl}
        onCreateAnother={handleCreateAnother}
      />
    );
  }

  return (
    <Card>
      <form
        onSubmit={(e) => void handleSubmit(e)}
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
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Custom alias

            <span className="ml-1 font-normal text-slate-400">
              (optional)
            </span>
          </label>

          <div className="flex">
            <span className="flex items-center rounded-l-lg border border-r-0 border-slate-300 bg-slate-50 px-3 text-sm text-slate-500">
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
              className={`min-w-0 flex-1 rounded-r-lg border px-4 py-3 outline-none focus:ring-2 ${
                errors.alias
                  ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                  : "border-slate-300 focus:border-slate-500 focus:ring-slate-200"
              }`}
            />
          </div>

          <FormError message={errors.alias} />
        </div>

        <Select
          id="expiry"
          name="expiry"
          label="Expiry"
          optional
          value={formData.expiry}
          onChange={handleChange}
          options={URL_CONFIG.expiryOptions}
        />

        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Creating..."
            : "Create Short URL"}
        </Button>
      </form>
    </Card>
  );
};

export default CreateUrlForm;