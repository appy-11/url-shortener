import { useState } from "react";

import Button from "../ui/Button";
import Card from "../ui/Card";
import Input from "../ui/Input";
import Select from "../ui/Select";

import { URL_CONFIG } from "@/config/url.config";
import { APP_CONFIG } from "@/config/app.config";

import type { CreateUrlPayload } from "@/types/url";

const CreateUrlForm = () => {
  const [formData, setFormData] =
    useState<CreateUrlPayload>({
      url: "",
      alias: "",
      expiry: "never",
    });

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
  };

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    console.log(formData);
  };

  return (
    <Card>
      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        <Input
          id="url"
          name="url"
          label="Long URL"
          type="url"
          placeholder="https://example.com/very/long/url"
          value={formData.url}
          onChange={handleChange}
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
              className="min-w-0 flex-1 rounded-r-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
          </div>
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

        <Button type="submit">
          Create Short URL
        </Button>
      </form>
    </Card>
  );
};

export default CreateUrlForm;