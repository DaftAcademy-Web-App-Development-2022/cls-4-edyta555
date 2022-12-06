import React, { useEffect } from "react";

import { useForm } from "react-hook-form";
import { DEFAULT_CARD_COLOR } from "~/config/common.config";
import { Model } from "~/models/Playlist.model";
import useSpotify from "~/hooks/useSpotify.hook";
import useList from "~/hooks/useList.hook";
import { BarsArrowDownIcon } from "@heroicons/react/20/solid";
import { Response as CreatedPlaylist } from "~/pages/api/playlist/[id]";

import styles from "./Form.module.css";

type FormData = Model;

interface Props {
  children?: React.ReactNode;
}

export const Form: React.FC<Props> = ({}) => {
  const { me } = useSpotify();

  const { mutate } = useList({
    limit: 0,
    revalidateOnMount: false,
    revalidateOnFocus: false,
  });

  const defaultFormFields = {
    name: "",
    owner: me?.display_name || "",
    slug: "",
    upvote: 0,
    spotifyId: "",
    color: DEFAULT_CARD_COLOR,
  };

  const {
    register,
    setValue,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<FormData>({
    defaultValues: {
      ...defaultFormFields,
    },
  });

  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    if (!me?.display_name) return;
    setValue("owner", me?.display_name);
  }, [me, setValue]);

  const onSubmit = handleSubmit(async (data) => {
    data.slug = data.name;
    try {
      setLoading(true);
      const response: Response = await fetch("/api/playlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`error status: ${response.status}`);
      }
      const result: CreatedPlaylist = await response.json();
      reset({ ...defaultFormFields });
      mutate();
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  });

  return (
    <>
      <div className={styles.root}>
        <form onSubmit={onSubmit}>
          <div className="mt-3">
            <div className={styles.info}>
              <label className={styles.label}>Nazwa playlisty</label>
              {errors.name && (
                <span className={styles.error}>Pole wymagane</span>
              )}
            </div>
            <div className="mt-1">
              <input
                type="text"
                autoComplete="off"
                className={styles.input}
                {...register("name", { required: true, maxLength: 60 })}
              />
            </div>
          </div>

          <div className="mt-3">
            <div className={styles.info}>
              <label className={styles.label}>Nazwa dodającego</label>
              {errors.owner && (
                <span className={styles.error}>Pole wymagane</span>
              )}
            </div>
            <div className="mt-1">
              <input
                type="text"
                autoComplete="off"
                className={styles.input}
                {...register("owner", { required: true, maxLength: 60 })}
              />
            </div>
          </div>

          <div className="mt-3">
            <div className={styles.info}>
              <label className={styles.label}>Id playlisty na Spotify</label>
              {errors.spotifyId && (
                <span className={styles.error}>Pole wymagane</span>
              )}
            </div>

            <div className={styles.search}>
              <div className={styles.searchWrapper}>
                <div className={styles.searchIconWrapper}>
                  <BarsArrowDownIcon
                    className={styles.searchIcon}
                    aria-hidden="true"
                  />
                </div>
                <input
                  type="text"
                  autoComplete="off"
                  {...register("spotifyId", { required: true, maxLength: 30 })}
                  className={styles.searchInput}
                />
              </div>
            </div>
          </div>

          <div className="mt-3">
            <div className={styles.info}>
              <label className={styles.label}>Kolor</label>
              {errors.color && (
                <span className={styles.error}>Kolor musi być w hexie</span>
              )}
            </div>

            <div className="mt-1">
              <input
                type="text"
                autoComplete="off"
                className={styles.input}
                {...register("color", {
                  pattern: RegExp("\\#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"),
                })}
              />
            </div>
          </div>

          <div className="mt-12 mb-4">
            <button className={styles.button} type="submit">
              Dodaj playlistę
              {loading && <span className={styles.loading}>Wysyłam...</span>}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Form;
