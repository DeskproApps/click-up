import { useRef, useState } from "react";
import omit from "lodash/omit";
import { faFile } from "@fortawesome/free-regular-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { AttachmentTag, Button, Stack } from "@deskpro/deskpro-ui";
import type { FC, ChangeEvent } from "react";
import type { AnyIcon  } from "@deskpro/deskpro-ui";

export type AttachmentFile = {
  name: string,
  size: number,
  id?: number,
  file?: File,
  delete?: boolean,
}

type Props = {
  id: string,
  onFiles?: (files: AttachmentFile[]) => void,
  existing?: AttachmentFile[],
}

const Attach: FC<Props> = ({ id, onFiles, existing }) => {
  const fileRef = useRef<HTMLInputElement>(null);

  const [fieldIdx, setFieldIdx] = useState<number>((existing ?? []).length);
  const [fields, setFields] = useState<string[]>([
    "file[0]",
    ...(existing ?? []).map((_, idx: number) => `file[${idx + 1}]`)
  ]);
  const [files, setFiles] = useState<Record<string, AttachmentFile>>(
    (existing ?? []).reduce((all, a, idx: number) => ({ ...all, [`file[${idx}]`]: a }), {}),
  );

  const upload = (e: ChangeEvent<HTMLInputElement>, name: string) => {
    if (!e.target.files || !e.target.files[0]) {
      return;
    }

    const file = e.target.files[0];

    const newFiles = {
      ...files,
      [name]: {
        file,
        name: file.name,
        size: file.size,
      } as AttachmentFile,
    };

    setFiles(newFiles);

    setFieldIdx(fieldIdx + 1);
    setFields([...fields, `file[${fieldIdx + 1}]`]);

    onFiles && onFiles(Object.values(newFiles));
  };

  const add = () => {
    fileRef.current && fileRef.current.click()
  };

  const remove = (name: string) => {
    if (files[name].id) {
      files[name].delete = true;
      setFiles(files);
      onFiles && onFiles(Object.values(files));
    } else {
      const remaining = omit(files, [name]);
      setFiles(remaining);
      onFiles && onFiles(Object.values(remaining));
    }
  };

  return (
    <>
      {fields.map((name: string, idx: number) => (
        <input
          id={id}
          key={idx}
          name={name}
          type="file"
          onChange={(e) => upload(e, name)}
          ref={idx === fieldIdx ? fileRef : null}
          style={{ display: "none" }}
        />
      ))}
      <Stack gap={3} vertical>
        {Object.keys(files).filter((name) => !files[name]?.delete).map((name, idx: number) => (
          <AttachmentTag
            key={idx}
            filename={files[name].name}
            fileSize={files[name].size}
            icon={faFile as AnyIcon}
            maxWidth="244px"
            withClose
            onClose={(e) => {
              e.preventDefault();
              remove(name);
            }}
          />
        ))}
        <Button
          minimal
          text="Add"
          icon={faPlus as AnyIcon}
          onClick={add}
        />
      </Stack>
    </>
  );
};

export { Attach };
