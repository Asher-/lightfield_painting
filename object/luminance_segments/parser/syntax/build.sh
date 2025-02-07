# for each .peggy file in ./
# run npx peggy --allowed-start-rules "*" --format es [file]

PARSER_FILES=(
  "parser"
)

for parser_file in ${PARSER_FILES[@]}; do
  file_name=${parser_file}.peggy
  npx peggy --format es ${file_name}
  #npx peggy --allowed-start-rules "*" --format es ${file_name}
  echo "Buildling ${file_name}"
  if [ $? -ne 0 ]; then
    exit
  fi
done
